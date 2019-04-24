package app

import (
	"webmail/eventbus"
	"webmail/rpc"
)

type App struct {
	Config *Config
	Events *eventbus.Eventbus

	ToMTChannel   chan []byte
	FromMTChannel chan []byte

	MTRpc *rpc.RPC
}
