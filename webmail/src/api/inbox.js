
const app = require("../app");
const tokencheck = require("./tokencheck");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const playermessages = require("../promise/playermessages");

app.get('/api/inbox', function(req, res){

	var payload = tokencheck(req, res);
	if (payload) {
		playermessages(payload.username)
		.then(list => res.json(list))
		.catch(e => res.status(500).end());
	}

});
