(function(){

var api = {};

api.fetchMails = function(){
	return m.request({
		url: "api/mail",
		headers: { "authorization": webmail.token }
	});
}

api.deleteMail = function(index){
	return m.request({
		method: "DELETE",
		url: "api/inbox/" + index, //TODO
		headers: { "authorization": webmail.token }
	});
}

api.markRead = function(index){
	return m.request({
		method: "POST",
		url: "api/markread", //TODO
		data: { index: index },
		headers: { "authorization": webmail.token }
	});
}

api.sendMail = function(receiver, subject, body){
	return m.request({
		method: "POST",
		url: "api/send",
		data: {
			receiver: receiver,
			subject: subject,
			body: body
		},
		headers: { "authorization": webmail.token }
	});
}

api.verifyToken = function(){
	return m.request({
		url: "api/verify",
		headers: { "authorization": webmail.token }
	});
}

api.login = function(username, password){
	return m.request({
		method: "POST",
		url: "api/login",
		data: { username: username, password: password }
	});
}



//publish
window.webmail.api = api;

})();
