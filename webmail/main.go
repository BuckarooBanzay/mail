package main

import (
	"log"
	"net/http"
)

func main() {
	
	http.Handle("/", http.FileServer(FS(false)))
	log.Fatal(http.ListenAndServe(":8080", nil))
}

