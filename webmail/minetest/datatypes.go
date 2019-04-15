package minetest

type Message struct {
	Sender      string   `json:"sender"`
	Receiver    string   `json:"receiver"`
	Subject     string   `json:"subject"`
	Body        string   `json:"body"`
	Time        int64    `json:"time"`
	Attachments []string `json:"attachments"`
}

type AuthRequest struct {
	Playername string `json:"playername"`
	Password   string `json:"password"`
}

type AuthResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type GetPlayerMailsRequest struct {
	Playername string `json:"playername"`
}

type MarkReadRequest struct {
	Playername string `json:"playername"`
	Index      int    `json:"index"`
	Subject    string `json:"subject"`
	Read       bool   `json:"read"`
}

type DeleteRequest struct {
	Playername string `json:"playername"`
	Index      int    `json:"index"`
	Subject    string `json:"subject"`
}

type GenericResultResponse struct {
	Success bool `json:"success"`
}
