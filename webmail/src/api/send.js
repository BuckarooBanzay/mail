
const app = require("../app");
const tokencheck = require("./tokencheck");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sendmessage = require("../promise/sendmessage");

app.post('/api/send', jsonParser, function(req, res){

	var payload = tokencheck(req, res);

	if (payload && req.body.recipient && req.body.subject && req.body.text) {
		sendmessage(payload.username, req.body.recipient, req.body.subject, req.body.text);
	}
	res.status(200).end();
});