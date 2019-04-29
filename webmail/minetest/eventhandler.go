package minetest

import (
	"encoding/json"
	"webmail/eventbus"
	"webmail/rpc"

	"github.com/sirupsen/logrus"
)

type EventListener struct {
	Events *eventbus.Eventbus
}

// events from mt to the webmail app
func (this *EventListener) OnNotification(notification *rpc.Notification) {

	var obj interface{}
	var eventType string

	switch notification.Method {
	case "new-message":
		obj = Message{}
		eventType = "new-message"
	}

	if eventType == "" {
		return
	}

	err := json.Unmarshal(notification.Params, &obj)
	if err != nil {
		fields := logrus.Fields{
			"error":     err,
			"method":    notification.Method,
			"params":    notification.Params,
			"eventType": eventType,
		}
		logrus.WithFields(fields).Error("unmarshal")
		return
	}

	this.Events.Emit(eventType, obj)
}
