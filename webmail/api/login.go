package api

import (
	"encoding/json"
	"net/http"

	"webmail/app"

	"github.com/gbrlsnchs/jwt/v3"
)

type UsernamePassword struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginHandler struct {
	ctx *app.App
}

func (this *LoginHandler) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	data := UsernamePassword{}

	err := decoder.Decode(&data)
	if err != nil {
		resp.WriteHeader(500)
		resp.Write([]byte(err.Error()))
		return
	}

	//TODO: check username/password

	hs256 := jwt.NewHMAC(jwt.SHA256, []byte(this.ctx.Config.SecretKey))
	h := jwt.Header{}
	jot := &Token{
		Username: data.Username,
	}

	token, err := jwt.Sign(h, jot, hs256)
	if err != nil {
		resp.WriteHeader(500)
		resp.Write([]byte(err.Error()))
		return
	}

	resp.Header().Add("content-type", "text/plain")
	resp.Write([]byte(token))
}
