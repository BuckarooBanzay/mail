
const app = require("../app");

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

function checkKey(req, res){

	if (!req.headers["webmailkey"] || req.headers["webmailkey"] != process.env.WEBMAILKEY){
		console.error("Invalid key: " + req.headers["webmailkey"]);
		res.status(403).end();
		return false;
	}

	return true;
}

app.get('/api/auth_collector', function(req, res){
	if (!checkKey(req, res))
		return;

	setTimeout(function(){
		res.json([{ name: "testuser", password: "enter" }]);
	}, 3000);
});


app.post('/api/auth_collector', jsonParser, function(req, res){
	if (!checkKey(req, res))
		return;

	//TODO
	console.log(req.body);
});

