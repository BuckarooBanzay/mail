package app

import (
	"webmail/eventbus"
)

func Setup(cfg *Config) *App {
	a := App{}
	a.Config = cfg
	a.WebEventbus = eventbus.New()

	return &a
}
