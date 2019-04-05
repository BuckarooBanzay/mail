package app

import (
	"webmail/eventbus"
)

type App struct {
	Config *Config
	Events *eventbus.Eventbus
}
