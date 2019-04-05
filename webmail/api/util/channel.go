package util

import (
	"net/http"
)

type Channel struct {
	Input chan []byte
	Output chan []byte
}

func (this *Channel) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
  if req.Method == "POST" {
    //POST
  } else {
    //GET
  }
}
