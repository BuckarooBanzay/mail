package minetest

type AuthResponse struct {
	Playername string `json:"playername"`
	Success    bool   `json:"success"`
	Message    string `json:"message"`
}
