package main

import (
	"log"
	"flag"
	"strconv"
	"net/http"
	"sync"
	PrivateHandlers "webmail/handlers/private"
)

func logger(h http.Handler, prefix string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("[%s] %s %s %s", prefix, r.RemoteAddr, r.Method, r.URL)
		h.ServeHTTP(w, r)
	})
}

func main() {
	var publicport, privateport int
	var help bool

	flag.IntVar(&publicport, "publicport", 8080, "Public port to listen on")
	flag.IntVar(&privateport, "privateport", 8081, "Private port to listen on")
	flag.BoolVar(&help, "help", false, "Show help and usage")
	flag.Parse()

	if (help){
		flag.PrintDefaults()
		return
	}
	
	log.Print("Listening on ports: public=", publicport, " private=", privateport)

	var wg sync.WaitGroup
	wg.Add(2)

	go func(){
		defer wg.Done()
		private_mux := http.NewServeMux()
		PrivateHandlers.Init(private_mux)
		log.Fatal(http.ListenAndServe(":" + strconv.Itoa(privateport), logger(private_mux, "private")))
	}()

	go func(){
		defer wg.Done()
		public_mux := http.NewServeMux()
		public_mux.Handle("/", http.FileServer(FS(false)))
		log.Fatal(http.ListenAndServe(":" + strconv.Itoa(publicport), logger(public_mux, "public")))
	}()

	wg.Wait()
}

