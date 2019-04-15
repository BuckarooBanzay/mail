package minetest

import (
	"webmail/eventbus"

	"encoding/json"

	"github.com/sirupsen/logrus"
)

type Request struct {
	Method string          `json:"method"`
	Id     int64           `json:"id"`
	Params json.RawMessage `json:"params"`
}

type Response struct {
	Method string          `json:"method"`
	Id     *int64          `json:"id"`
	Result json.RawMessage `json:"result"`
}

func HandleEvents(events *eventbus.Eventbus, output chan []byte) {
	data := <-output

	response := Response{}
	err := json.Unmarshal(data, &response)
	if err != nil {
		fields := logrus.Fields{
			"error": err,
			"data":  data,
		}
		logrus.WithFields(fields).Error("event unmarshal")
		return
	}

	var obj interface{}
	var eventType string

	switch response.Method {
	case "new-message":
		obj = Message{}
		eventType = "new-message"

	case "player-messages":
	case "auth":
		obj = AuthResponse{}
		eventType = "auth-response"

	}

	err = json.Unmarshal(response.Result, &obj)
	if err != nil {
		fields := logrus.Fields{
			"error":     err,
			"result":    response.Result,
			"eventType": eventType,
		}
		logrus.WithFields(fields).Error("unmarshal")
		return
	}

}
