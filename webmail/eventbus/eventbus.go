package eventbus

import (
	"sync"
)

const (
	MAIL_RECEIVED = "mail-received"
)

type Listener interface {
	OnEvent(eventtype string, o interface{})
}

type Eventbus struct {
	mutex     *sync.RWMutex
	listeners []Listener
}

func New() *Eventbus {
	eb := Eventbus{}
	eb.mutex = &sync.RWMutex{}
	eb.listeners = make([]Listener, 0)

	return &eb
}

func (this *Eventbus) Emit(eventtype string, o interface{}) {
	this.mutex.RLock()
	defer this.mutex.RUnlock()

	for _, l := range this.listeners {
		l.OnEvent(eventtype, o)
	}
}

func (this *Eventbus) AddListener(l Listener) {
	this.mutex.Lock()
	defer this.mutex.Unlock()

	this.listeners = append(this.listeners, l)
}

func (this *Eventbus) RemoveListener(l Listener) {
	this.mutex.Lock()
	defer this.mutex.Unlock()

	newlist := make([]Listener, 0)

	for _, item := range this.listeners {
		if l != item {
			newlist = append(newlist, item)
		}
	}

	this.listeners = newlist
}
