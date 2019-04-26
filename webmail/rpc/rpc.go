package rpc

import (
	"encoding/json"
	"errors"
	"math/rand"
	"sync"
	"time"
)

func New(in chan []byte, out chan []byte) *RPC {
	return &RPC{
		in:        in,
		out:       out,
		results:   make(map[int]chan *Response),
		listeners: make([]NotificationListener, 0),
		mutex:     &sync.RWMutex{},
	}
}

type Request struct {
	Id     int         `json:"id"`
	Method string      `json:"method"`
	Params interface{} `json:"params"`
}

type Notification struct {
	Method string      `json:"method"`
	Params interface{} `json:"params"`
}

type Response struct {
	Id     *int            `json:"id"`
	Method string          `json:"method"`
	Result json.RawMessage `json:"result"`
}

type NotificationListener interface {
	OnNotification(notification *Notification)
}

type RPC struct {
	in        chan []byte
	out       chan []byte
	results   map[int]chan *Response
	listeners []NotificationListener
	mutex     *sync.RWMutex
}

func (this *RPC) Request(method string, params interface{}, result interface{}) error {
	req := Request{
		Id:     rand.Intn(64000),
		Method: method,
		Params: params,
	}

	jsonData, err := json.Marshal(req)

	if err != nil {
		return err
	}

	resChannel := make(chan *Response)
	this.results[req.Id] = resChannel
	var res *Response

	this.out <- []byte(jsonData)

	select {
	case res = <-resChannel:
	case <-time.After(1 * time.Second):
	}

	close(resChannel)
	delete(this.results, req.Id)

	if res == nil {
		return errors.New("timeout")
	}

	err = json.Unmarshal(res.Result, result)

	return err
}

func (this *RPC) AddNotificationListener(listener NotificationListener) {
	this.mutex.Lock()
	defer this.mutex.Unlock()

	this.listeners = append(this.listeners, listener)
}

func (this *RPC) Loop() {
	for data := range this.in {
		res := &Response{}
		err := json.Unmarshal(data, res)

		if err != nil {
			//TODO
			continue
		}

		if res.Id == nil {
			//Notification
			n := &Notification{}
			err = json.Unmarshal(data, n)

			if err != nil {
				//TODO
				continue
			}

			this.mutex.RLock()
			defer this.mutex.RUnlock()

			for _, l := range this.listeners {
				l.OnNotification(n)
			}

			continue
		}

		resChannel := this.results[*res.Id]

		if resChannel == nil {
			//TODO
			continue
		}

		resChannel <- res

	}
}
