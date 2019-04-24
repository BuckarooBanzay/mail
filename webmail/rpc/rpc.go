package rpc

import (
	"encoding/json"
	"errors"
	"math/rand"
	"time"
)

func New(in chan []byte, out chan []byte) *RPC {
	return &RPC{
		in:      in,
		out:     out,
		results: make(map[int]chan *Response),
	}
}

type Request struct {
	Id     int         `json:"id"`
	Method string      `json:"method"`
	Params interface{} `json:"params"`
}

type Response struct {
	Id     *int            `json:"id"`
	Method string          `json:"method"`
	Result json.RawMessage `json:"result"`
}

type RPC struct {
	in      chan []byte
	out     chan []byte
	results map[int]chan *Response
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

func (this *RPC) Loop() {
	for data := range this.in {
		res := &Response{}
		err := json.Unmarshal(data, res)

		if err != nil {
			//TODO
			continue
		}

		if res.Id == nil {
			//TODO
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
