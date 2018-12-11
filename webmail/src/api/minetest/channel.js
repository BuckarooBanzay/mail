
const app = require("../../app");
const events = require("../../events");
const keycheck = require("./keycheck");

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const debug = true;

// web -> mod
app.get('/api/minetest/channel', function(req, res){
	if (!keycheck(req, res))
		return;

	function handleEvent(obj){
		clearTimeout(handle);
		if (debug)
			console.log("[tx]", obj);
		res.json(obj);
	}

	var handle = setTimeout(function(){
		res.json(null);
		events.removeListener("channel-send", handleEvent);
	}, 10000);

	events.once("channel-send", handleEvent);
});

// mod -> web
app.post('/api/minetest/channel', jsonParser, function(req, res){
	if (!keycheck(req, res))
		return;

	if (debug)
		console.log("[rx]", req.body);

	events.emit("channel-recv", req.body);

	res.end();
});

