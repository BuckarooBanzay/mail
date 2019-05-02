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
			Result: json.RawMessage(`666`),
		}

		data, err = json.Marshal(resp)

		in <- data

	}()

	var result int

	err := rpc.Request("test", 123, &result)

	if err != nil {
		t.Fatal(err)
	}

	if result != 666 {
		t.Fatal(result)
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

	var result int

	err := rpc.Request("test", 123, &result)

	if err == nil {
		t.Fatal("no error")
	}

	close(in)
	close(out)

}

type MyListener struct {
	notification *Notification
}

func (this *MyListener) OnNotification(notification *Notification) {
	this.notification = notification
}

func TestNotification(t *testing.T) {

	in := make(chan []byte)
	out := make(chan []byte)
	rpc := New(in, out)

	go rpc.Loop()

	l := &MyListener{}
	rpc.AddNotificationListener(l)

	n := Notification{
		Method: "test",
		Params: json.RawMessage("123"),
	}

	data, _ := json.Marshal(n)
	in <- data

	time.Sleep(50 * time.Millisecond)

	if l.notification == nil {
		t.Fatal("no notification")
	}

	if l.notification.Method != "test" {
		t.Fatal("wrong method")
	}

	var params float64
	err := json.Unmarshal(l.notification.Params, &params)

	if err != nil {
		t.Fatal(err)
	}

	if params < 122.9 || params > 123.1 {
		t.Fatal("wrong params", params)
	}

	close(in)
	close(out)

}
