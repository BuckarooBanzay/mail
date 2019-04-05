package main

import (
	"log"
	"flag"
	"strconv"
	"net/http"
	"webmail/vfs"
	"webmail/bundle"
)

//go:generate sh -c "go run github.com/mjibson/esc -o vfs/static.go -prefix='static/' -pkg vfs static"


func logger(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("[Request] %s %s %s", r.RemoteAddr, r.Method, r.URL)
		h.ServeHTTP(w, r)
	})
}

func main() {
	var port int
	var help bool

	flag.IntVar(&port, "port", 8080, "port to listen on")
	flag.BoolVar(&help, "help", false, "Show help and usage")
	flag.Parse()

	if (help){
		flag.PrintDefaults()
		return
	}

	log.Print("Listening on port: ", port)

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(vfs.FS(false)))
	mux.Handle("/js/bundle.js", bundle.NewJsHandler(false))
	mux.Handle("/css/bundle.css", bundle.NewCSSHandler(false))

	log.Fatal(http.ListenAndServe(":" + strconv.Itoa(port), logger(mux)))

}
