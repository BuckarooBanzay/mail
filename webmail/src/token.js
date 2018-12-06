var jwt = require('jsonwebtoken');


const secret = process.env.WEBMAILKEY;


module.exports = {
	sign: function(payload){
		return jwt.sign(payload, secret);
	},

	verify: function(token){
		try {
			return jwt.verify(token, secret);
		} catch(err) {
			return false;
		}
	}
};