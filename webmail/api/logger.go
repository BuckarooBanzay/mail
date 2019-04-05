package api

import (
	"net/http"

	"github.com/sirupsen/logrus"
)

func Logger(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fields := logrus.Fields{
			"remote": r.RemoteAddr,
			"method": r.Method,
			"url":    r.URL,
		}
		logrus.WithFields(fields).Debug("Request")

		h.ServeHTTP(w, r)
	})
}
