(function(){

var api = {};

api.fetchMails = function(){
	return m.request({
		url: "api/inbox",
		headers: { "authorization": webmail.token }
	});
};

api.deleteMail = function(index){
	return m.request({
		method: "DELETE",
		url: "api/inbox/" + index,
		headers: { "authorization": webmail.token }
	});
};

api.markRead = function(index){
	return m.request({
		method: "POST",
		url: "api/markread",
		data: { index: index },
		headers: { "authorization": webmail.token }
	});
};

api.sendMail = function(recipient, subject, text){
	return m.request({
		method: "POST",
		url: "api/send",
		data: {
			recipient: recipient,
			subject: subject,
			text: text
		},
		headers: { "authorization": webmail.token }
	});
};

api.verifyToken = function(){
	return m.request({
		url: "api/verify",
		headers: { "authorization": webmail.token }
	});
};

api.login = function(username, password){
	return m.request({
		method: "POST",
		url: "api/login",
		data: { username: username, password: password }
	});
};



//publish
window.webmail.api = api;

})();
