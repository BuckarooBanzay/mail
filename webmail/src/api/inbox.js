
const app = require("../app");
const store = require("../store");

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()


app.get('/api/inbox/:name', function(req, res){

	var name = req.params.name;

	console.log(req.params, store);

	if (name && store.messages[name])
		res.json(store.messages[name]);
	else
		res.end();

});
