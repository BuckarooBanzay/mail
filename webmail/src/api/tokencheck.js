
const token = require("../token");

module.exports = function(req, res){

	var auth = req.headers["authorization"];
	var payload = token.verify(auth);

	if (auth && payload){
		return payload;
	}

	res.status(403).end();
	return false;
}
