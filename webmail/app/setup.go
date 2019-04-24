package app

import (
	"webmail/eventbus"
	"webmail/rpc"
)

func Setup(cfg *Config) *App {
	a := App{}
	a.Config = cfg
	a.Events = eventbus.New()

	a.FromMTChannel = make(chan []byte)
	a.ToMTChannel = make(chan []byte)

	a.MTRpc = rpc.New(a.FromMTChannel, a.ToMTChannel)

	return &a
}
