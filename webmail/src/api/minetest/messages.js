
const app = require("../../app");
const events = require("../../events");
const store = require("../../store");
const keycheck = require("./keycheck");

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

// web -> mod
app.get('/api/minetest/messages', function(req, res){
	if (!keycheck(req, res))
		return;

	/*
		possible message commands:

		{ type: "send", mail: { src,dst,subject,body } }
		{ type: "mark-read", data: {} }
		{ type: "mark-unread", data: {} }
		{ type: "delete", data: {} }
	*/

	setTimeout(function(){
		res.json([]);
		//res.json([{ type: "send", mail: { src:"admin", dst: "testuser", subject: "blah", body: "x\ny\nz" } }]);
	}, 10000);
});

// mod -> web
app.post('/api/minetest/messages', jsonParser, function(req, res){
	if (!keycheck(req, res))
		return;

	console.log(req.body);

	store.messages = req.body;
	events.emit("messages-update", req.body);

	res.end()
});

