package api

import (
	"encoding/json"
	"net/http"
	"webmail/app"
)

type MailHandler struct {
	ctx *app.App
}

func (this *MailHandler) ServeHTTP(resp http.ResponseWriter, req *http.Request, token *app.Token) {

	json.NewEncoder(resp).Encode("ok")
}
