package api

import (
	"net/http"

	"webmail/app"
)

type MinetestHandler struct {
	ctx *app.App
}

func (this *MinetestHandler) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
}
