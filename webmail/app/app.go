package app

import (
	"webmail/eventbus"
)

type App struct {
	Config      *Config
	WebEventbus *eventbus.Eventbus
}
