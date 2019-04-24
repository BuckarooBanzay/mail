package rpc

import (
	"encoding/json"
	"testing"
	"time"
)

func TestRequest(t *testing.T) {

	in := make(chan []byte)
	out := make(chan []byte)

	rpc := New(in, out)

	go rpc.Loop()

	go func() {
		data := <-out

		time.Sleep(50 * time.Millisecond)

		req := &Request{}
		err := json.Unmarshal(data, req)

		if err != nil {
			t.Fatal(err)
		}

		resp := Response{
			Id:     &req.Id,
			Method: req.Method,
		}

		data, err = json.Marshal(resp)

		in <- data

	}()

	result, err := rpc.Request("test", 123)

	if err != nil {
		t.Fatal(err)
	}

	if result == nil {
		t.Fatal(err)
	}

	close(in)
	close(out)

}

func TestRequestTimeout(t *testing.T) {

	in := make(chan []byte)
	out := make(chan []byte)

	rpc := New(in, out)

	go func() {
		<-out
	}()

	_, err := rpc.Request("test", 123)

	if err == nil {
		t.Fatal("no error")
	}

	close(in)
	close(out)

}
