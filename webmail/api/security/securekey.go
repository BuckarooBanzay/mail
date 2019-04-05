package security

import (
	"net/http"
)

type SecureKeyHandler struct {
	secured http.Handler
	key     string
}

func SecureKey(key string, secured http.Handler) *SecureKeyHandler {
	return &SecureKeyHandler{
		secured: secured,
		key:     key,
	}
}

func (this *SecureKeyHandler) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	token := req.Header.Get("Authorization")

	if token != this.key {
		resp.WriteHeader(403)
		resp.Write([]byte("Unauthorized"))
		return
	}

	this.secured.ServeHTTP(resp, req)
}
