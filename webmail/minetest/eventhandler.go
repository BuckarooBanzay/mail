package minetest

import (
	"webmail/eventbus"

	"encoding/json"
	"github.com/sirupsen/logrus"
)

type Payload struct {
	Type string          `json:"type"`
	Id   int64           `json:"id"`
	Data json.RawMessage `json:"data"`
}

func HandleEvents(events *eventbus.Eventbus, output chan []byte) {
	data := <-output

	payload := Payload{}
	err := json.Unmarshal(data, &payload)
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

	switch payload.Type {
	case "new-message":
		obj = Message{}
		eventType = "new-message"

	case "player-messages":
	case "auth":
	}

	err = json.Unmarshal(payload.Data, &obj)
	if err != nil {
		fields := logrus.Fields{
			"error":     err,
			"data":      payload.Data,
			"eventType": eventType,
		}
		logrus.WithFields(fields).Error("unmarshal")
		return
	}

}
