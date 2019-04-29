package api

import (
	"encoding/json"
	"net/http"

	"webmail/app"
)

type VerifyHandler struct {
	ctx *app.App
}

func (this *VerifyHandler) ServeHTTP(resp http.ResponseWriter, req *http.Request, token *app.Token) {
	json.NewEncoder(resp).Encode(token)
}
