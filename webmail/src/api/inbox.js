
const app = require("../app");
const tokencheck = require("./tokencheck");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const playermessages = require("../promise/playermessages");
const deletemessage = require("../promise/deletemessage");

app.get('/api/inbox', function(req, res){

	var payload = tokencheck(req, res);
	if (payload) {
		playermessages(payload.username)
		.then(list => {
			var i = 1;
			res.json(list.map(mail => {
					mail.index = i++;
					return mail;
				})
			);
		})
		.catch(e => res.status(500).end());
	}

});

app.delete("/api/inbox/:id", function(req, res){
	var payload = tokencheck(req, res);
	if (payload && req.params.id) {
		deletemessage(payload.username, req.params.id);
	}

	res.status(200).end();
});
