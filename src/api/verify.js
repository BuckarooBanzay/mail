
const app = require("../app");
const tokencheck = require("./tokencheck");

app.get('/api/verify', function(req, res){
	var payload = tokencheck(req, res);
	if (payload) {
		res.json(payload);
	}

});

