import state from './state.js';

export const fetchMails = function(){
	return m.request({
		url: "api/inbox",
		headers: { "authorization": state.token }
	});
};

export const deleteMail = function(index){
	return m.request({
		method: "DELETE",
		url: "api/inbox/" + index,
		headers: { "authorization": state.token }
	});
};

export const markRead = function(index){
	return m.request({
		method: "POST",
		url: "api/markread",
		data: { index: index },
		headers: { "authorization": state.token }
	});
};

export const sendMail = function(recipient, subject, text){
	return m.request({
		method: "POST",
		url: "api/send",
		data: {
			recipient: recipient,
			subject: subject,
			text: text
		},
		headers: { "authorization": state.token }
	});
};

export const verifyToken = function(){
	return m.request({
		url: "api/verify",
		headers: { "authorization": state.token }
	});
};

export const login = function(username, password){
	return m.request({
		method: "POST",
		url: "api/login",
		data: { username: username, password: password }
	});
};
