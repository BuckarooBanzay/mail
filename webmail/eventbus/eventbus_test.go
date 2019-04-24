package eventbus

import (
	"testing"
)

type MyListener struct {
	count int
}

func (this *MyListener) OnEvent(eventtype string, o interface{}) {
	if eventtype == "x" && o.(int) == 123 {
		this.count++
	}
}

func TestAddRemove(t *testing.T) {
	e := New()

	l := &MyListener{}

	e.AddListener(l)
	e.AddListener(&MyListener{})

	if l.count != 0 {
		t.Fatal("count error", l.count)
	}

	e.Emit("x", 123)

	if l.count != 1 {
		t.Fatal("count error", l.count)
	}

	e.Emit("y", 123)
	e.Emit("x", 456)

	if l.count != 1 {
		t.Fatal("count error", l.count)
	}

	e.RemoveListener(l)

	e.Emit("x", 123)

	if l.count != 1 {
		t.Fatal("count error", l.count)
	}

}
