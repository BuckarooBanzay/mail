package main

import (
	"log"
	"flag"
	"strconv"
	"net/http"
)

func main() {
	var port int

	flag.IntVar(&port, "port", 8080, "Port to listen on")
	flag.Parse()
	
	log.Print("Listening on port ", port)

	http.Handle("/", http.FileServer(FS(false)))
	log.Fatal(http.ListenAndServe(":" + strconv.Itoa(port), nil))
}

