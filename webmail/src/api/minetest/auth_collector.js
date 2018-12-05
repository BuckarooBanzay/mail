
const app = require("../../app");
const events = require("../../events");
const keycheck = require("./keycheck");

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()


app.get('/api/minetest/auth_collector', function(req, res){
	if (!keycheck(req, res))
		return;

	function handleEvent(auth){
		clearTimeout(handle);
		res.json(auth);
	}

	var handle = setTimeout(function(){
		res.json(null);
		events.removeListener("login", handleEvent);
	}, 10000);

	events.once("login", handleEvent);
});


app.post('/api/minetest/auth_collector', jsonParser, function(req, res){
	if (!keycheck(req, res))
		return;

	events.emit("login-response", req.body);

	res.end();
});

