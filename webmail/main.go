package main

import (
	"log"
	"flag"
	"strconv"
	"net/http"
)


func logger(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s requested %s", r.RemoteAddr, r.URL)
		h.ServeHTTP(w, r)
	})
}

func main() {
	var publicport, privateport int

	flag.IntVar(&publicport, "publicport", 8080, "Public port to listen on")
	flag.IntVar(&privateport, "privateport", 8081, "Private port to listen on")
	flag.Parse()
	
	log.Print("Listening on ports: public=", publicport, " private=", privateport)

	h := http.NewServeMux()
	h.Handle("/", http.FileServer(FS(false)))

	log.Fatal(http.ListenAndServe(":" + strconv.Itoa(publicport), logger(h)))
}

