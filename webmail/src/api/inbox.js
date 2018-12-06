
const app = require("../app");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const playermessages = require("../promise/playermessages");

app.get('/api/inbox/:name', function(req, res){

	var name = req.params.name;

	playermessages(name)
	.then(list => res.json(list))
	.catch(e => res.status(500).end());
});
