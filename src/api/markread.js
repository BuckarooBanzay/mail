
const app = require("../app");
const tokencheck = require("./tokencheck");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const markmessage = require("../promise/markmessage");

app.post('/api/markread', jsonParser, function(req, res){

	var payload = tokencheck(req, res);
	if (payload && req.body.index) {
		markmessage(payload.username, req.body.index);
	}
	res.status(200).end();
});