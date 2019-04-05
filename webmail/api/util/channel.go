package util

import (
	"io/ioutil"
	"net/http"
	"time"
)

type Channel struct {
	Input  chan []byte
	Output chan []byte
}

func (this *Channel) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		//POST
		this.doPost(resp, req)

	} else {
		//GET
		this.doGet(resp, req)

	}
}

func (this *Channel) doGet(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Add("content-type", "application/json")

	select {
	case data := <-this.Input:
		resp.Write(data)

	case <-time.After(10 * time.Second):
		resp.WriteHeader(204)

	}
}

func (this *Channel) doPost(resp http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		resp.WriteHeader(500)
		resp.Write([]byte(err.Error()))
		return
	}

	this.Output <- body

	//no content
	resp.WriteHeader(204)

}
