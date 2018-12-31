package private

import (
	"net/http"
)

func handleGet(w http.ResponseWriter, r *http.Request){
}

func handlePost(w http.ResponseWriter, r *http.Request){
}


func Init(mux *http.ServeMux){
	mux.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
		if (r.Method == "GET"){
			handleGet(w, r)
		}
		if (r.Method == "POST"){
			handlePost(w, r)
		}
	})
}