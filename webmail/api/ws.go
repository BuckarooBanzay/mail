package api

import (
	"math/rand"
	"net/http"
	"sync"
	"webmail/app"

	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

type WS struct {
	ctx      *app.App
	channels map[int]chan Event
	mutex    *sync.RWMutex
	clients  int
}

type Event struct {
	Type string
	Data interface{}
}

func NewWS(ctx *app.App) *WS {
	ws := WS{}
	ws.mutex = &sync.RWMutex{}
	ws.channels = make(map[int]chan Event)

	return &ws
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (t *WS) OnEvent(eventtype string, o interface{}) {

	t.mutex.RLock()
	defer t.mutex.RUnlock()

	e := Event{
		Type: eventtype,
		Data: o,
	}

	for _, c := range t.channels {
		select {
		case c <- e:
		default:
		}
	}
}

func (t *WS) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	conn, err := upgrader.Upgrade(resp, req, nil)

	if err != nil {
		fields := logrus.Fields{
			"err": err,
		}
		logrus.WithFields(fields).Error("ws-upgrade")

	}

	id := rand.Intn(64000)
	ch := make(chan Event)

	t.mutex.Lock()
	t.channels[id] = ch
	t.clients++
	t.mutex.Unlock()

	for {
		e := <-ch

		err := conn.WriteMessage(websocket.TextMessage, []byte(e.Type)) //TODO
		if err != nil {
			break
		}
	}

	t.mutex.Lock()
	t.clients--
	delete(t.channels, id)
	close(ch)
	t.mutex.Unlock()
}
