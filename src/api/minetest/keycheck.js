
module.exports = function(req, res){

	if (!req.headers.webmailkey || req.headers.webmailkey != process.env.WEBMAILKEY){
		console.error("Invalid key: " + req.headers.webmailkey);
		res.status(403).end();
		return false;
	}

	return true;
};
