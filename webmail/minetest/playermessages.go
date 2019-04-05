package minetest

type PlayerMessages struct {
	Playername string    `json:"playername"`
	Messages   []Message `json:"messages"`
}
