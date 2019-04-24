package security

import (
	"net/http"
	"webmail/app"

	"github.com/gbrlsnchs/jwt/v3"
)

type SecureTokenHandler struct {
	secured SecuredHandler
	key     string
}

type SecuredHandler interface {
	ServeHTTP(resp http.ResponseWriter, req *http.Request, token *app.Token)
}

func SecureToken(key string, secured SecuredHandler) *SecureTokenHandler {
	return &SecureTokenHandler{
		secured: secured,
		key:     key,
	}
}

func (this *SecureTokenHandler) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	hs256 := jwt.NewHMAC(jwt.SHA256, []byte(this.key))

	token := req.Header.Get("Authorization")

	raw, err := jwt.Parse([]byte(token))
	if err != nil {
		resp.WriteHeader(500)
		resp.Write([]byte(err.Error()))
		return
	}

	err = raw.Verify(hs256)
	if err != nil {
		resp.WriteHeader(403)
		resp.Write([]byte(err.Error()))
		return
	}

	var jot app.Token
	if _, err = raw.Decode(&jot); err != nil {
		resp.WriteHeader(500)
		resp.Write([]byte(err.Error()))
		return
	}

	this.secured.ServeHTTP(resp, req, &jot)
}
