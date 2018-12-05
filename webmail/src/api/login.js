
const app = require("../app");


const doLogin = require("../promise/login");

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

app.post('/api/login', jsonParser, function(req, res){

	doLogin(req.body.username, req.body.password)
	.then(result => {
		res.json(result);
	})
	.catch(e => {
		console.error(e);
		res.status(500).end();
	});


});

