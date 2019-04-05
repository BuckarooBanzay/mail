package main

import (
	"flag"
	"fmt"
	"net/http"
	"runtime"
	"strconv"

	"webmail/app"
	"webmail/bundle"
	"webmail/vfs"

	"github.com/sirupsen/logrus"
)

//go:generate sh -c "go run github.com/mjibson/esc -o vfs/static.go -prefix='static/' -pkg vfs static"

func logger(h http.Handler) http.Handler {
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

func main() {

	//parse Config
	cfg, err := app.ParseConfig(app.ConfigFile)
	if err != nil {
		panic(err)
	}

	//write back config with all values
	err = cfg.Save()
	if err != nil {
		panic(err)
	}

	var version bool
	var help bool
	var debug bool

	flag.BoolVar(&debug, "debug", false, "enable debug log")
	flag.BoolVar(&version, "version", false, "Show version")
	flag.BoolVar(&help, "help", false, "Show help and usage")
	flag.Parse()

	if help {
		flag.PrintDefaults()
		return
	}

	if version {
		fmt.Print("Webmail version: ")
		fmt.Println(app.Version)
		fmt.Print("OS: ")
		fmt.Println(runtime.GOOS)
		fmt.Print("Architecture: ")
		fmt.Println(runtime.GOARCH)
		return
	}

	if debug {
		logrus.SetLevel(logrus.DebugLevel)
	} else {
		logrus.SetLevel(logrus.InfoLevel)
	}

	fields := logrus.Fields{
		"port": cfg.Port,
	}
	logrus.WithFields(fields).Info("Starting webmail")

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(vfs.FS(false)))
	mux.Handle("/js/bundle.js", bundle.NewJsHandler(false))
	mux.Handle("/css/bundle.css", bundle.NewCSSHandler(false))

	logrus.Error(http.ListenAndServe(":"+strconv.Itoa(cfg.Port), logger(mux)))

}
