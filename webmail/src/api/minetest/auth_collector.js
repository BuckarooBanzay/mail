
const app = require("../../app");
const keycheck = require("./keycheck");

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()


app.get('/api/minetest/auth_collector', function(req, res){
	if (!keycheck(req, res))
		return;

	setTimeout(function(){
		//res.json([{ name: "testuser", password: "enter" }]);
		res.json([]);
	}, 10000);
});


app.post('/api/minetest/auth_collector', jsonParser, function(req, res){
	if (!keycheck(req, res))
		return;

	//TODO
	console.log(req.body);

	res.end();
});

