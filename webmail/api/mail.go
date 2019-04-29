package api

import (
	"encoding/json"
	"net/http"
	"webmail/app"
	"webmail/minetest"
)

type MailHandler struct {
	ctx *app.App
}

func (this *MailHandler) ServeHTTP(resp http.ResponseWriter, req *http.Request, token *app.Token) {
	if req.Method == "POST" {
		//POST
		this.doPost(resp, req, token)
	} else {
		//GET
		this.doGet(resp, req, token)
	}
}

func (this *MailHandler) doGet(resp http.ResponseWriter, req *http.Request, token *app.Token) {

	mtReq := minetest.GetPlayerMailsRequest{
		Playername: token.Username,
	}

	mtRes := make([]minetest.Message, 0)

	err := this.ctx.MTRpc.Request(minetest.GetPlayerMailMethod, mtReq, &mtRes)

	if err != nil {
		resp.WriteHeader(500)
		resp.Write([]byte(err.Error()))
		return
	}

	json.NewEncoder(resp).Encode(mtRes)
}

func (this *MailHandler) doPost(resp http.ResponseWriter, req *http.Request, token *app.Token) {
	decoder := json.NewDecoder(req.Body)
	msg := minetest.Message{}

	err := decoder.Decode(&msg)
	if err != nil {
		resp.WriteHeader(500)
		resp.Write([]byte(err.Error()))
		return
	}

	//use logged in user as sender
	msg.Sender = token.Username

	sendResp := minetest.GenericResultResponse{}

	err = this.ctx.MTRpc.Request(minetest.SendMessageMethod, msg, &sendResp)

	if err != nil {
		resp.WriteHeader(500)
		resp.Write([]byte(err.Error()))
		return
	}

	json.NewEncoder(resp).Encode(sendResp)
}
