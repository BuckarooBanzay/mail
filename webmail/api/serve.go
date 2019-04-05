package api

import (
	"net/http"
	"strconv"

	"webmail/api/security"
	"webmail/api/util"
	"webmail/app"
	"webmail/bundle"
	"webmail/vfs"

	"github.com/sirupsen/logrus"
)

func Serve(ctx *app.App) {
	fields := logrus.Fields{
		"port":   ctx.Config.Port,
		"webdev": ctx.Config.Webdev,
	}
	logrus.WithFields(fields).Info("Starting http server")

	mux := http.NewServeMux()

	mux.Handle("/", http.FileServer(vfs.FS(ctx.Config.Webdev)))

	mux.Handle("/js/bundle.js", bundle.NewJsHandler(ctx.Config.Webdev))
	mux.Handle("/css/bundle.css", bundle.NewCSSHandler(ctx.Config.Webdev))

	mux.Handle("/api/config", &ConfigHandler{ctx: ctx})
	mux.Handle("/api/login", &LoginHandler{ctx: ctx})

	in := make(chan []byte)
	out := make(chan []byte)

	channel := util.Channel{
		Input: in,
		Output: out,
	}

	mux.Handle("/api/channel", security.SecureKey(ctx.Config.SecretKey, &channel))

	err := http.ListenAndServe(":"+strconv.Itoa(ctx.Config.Port), Logger(mux))
	if err != nil {
		panic(err)
	}
}
