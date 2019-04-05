package minetest

type Message struct {
	Source      string `json:"src"`
	Destination string `json:"dst"`
	Subject     string `json:"subject"`
	Body        string `json:"body"`
}
