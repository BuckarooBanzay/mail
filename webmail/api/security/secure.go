package security

import (
	"github.com/gbrlsnchs/jwt/v3"
	"net/http"
)

type SecureHandler struct {
	secured http.Handler
	key     string
}

func Secure(key string, secured http.Handler) *SecureHandler {
	return &SecureHandler{
		secured: secured,
		key:     key,
	}
}

func (this *SecureHandler) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
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

	var jot Token
	if _, err = raw.Decode(&jot); err != nil {
		resp.WriteHeader(500)
		resp.Write([]byte(err.Error()))
		return
	}

	this.secured.ServeHTTP(resp, req)
}
