package main

import (
	"flag"
	"log"
	"net/http"
	"strconv"
	"webmail/app"
	"webmail/bundle"
	"webmail/vfs"
)

//go:generate sh -c "go run github.com/mjibson/esc -o vfs/static.go -prefix='static/' -pkg vfs static"

func logger(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("[Request] %s %s %s", r.RemoteAddr, r.Method, r.URL)
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

	flag.BoolVar(&version, "version", false, "Show version")
	flag.BoolVar(&help, "help", false, "Show help and usage")
	flag.Parse()

	if help {
		flag.PrintDefaults()
		return
	}

	log.Print("Listening on port: ", cfg.Port)

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(vfs.FS(false)))
	mux.Handle("/js/bundle.js", bundle.NewJsHandler(false))
	mux.Handle("/css/bundle.css", bundle.NewCSSHandler(false))

	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(cfg.Port), logger(mux)))

}
