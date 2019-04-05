package app

import (
	"webmail/eventbus"
)

func Setup(cfg *Config) *App {
	a := App{}
	a.Config = cfg
	a.Events = eventbus.New()

	return &a
}
