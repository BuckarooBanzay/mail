import state from './state.js';
import {
	markRead,
	verifyToken,
	login as api_login,
	fetchMails as api_fetchMails,
	sendMail as api_sendMail,
	deleteMail as api_deleteMail
} from './api.js';

//verify token if available
if (state.token){
	verifyToken()
	.then(function(result){
		if (result.username){
			state.loginState.username = result.loginState.username;
			state.loginState.loggedIn = true;
			//fetch messages after token alright
			fetchMails();
		}
	});
}


export const login = function(username, password){
	if (!username || !password)
		return;

	state.loginState.errorMsg = "";
	state.loginState.busy = true;

	api_login(username, password)
	.then(function(result){
		state.loginState.busy = false;
		if (result.success){
			state.loginState.loggedIn = true;
			state.loginState.errorMsg = "";

			//save token
			state.token = result.token;
			localStorage["webmail-token"] = result.token;

			//fetch mails after login
			fetchMails();
		} else {
			state.loginState.errorMsg = "Login failed: " + result.message;
		}
	})
	.catch(function(){
		state.loginState.errorMsg = "System error!";
		state.loginState.busy = false;
	});
};

export const logout = function(){
	state.loginState.loggedIn = false;
	state.mails = [];

	//clear token
	state.token = null;
	delete localStorage["webmail-token"];
};

export const fetchMails = function(){
	if (!state.mails || !state.mails.length){
		api_fetchMails()
		.then(function(result){
			state.mails = result;
		});
	}
};

export const countUnread = function(){
	var count = 0;
	if (state.mails && state.mails.length){
		state.mails.forEach(function(mail){
			if (mail.unread)
				count++;
		});
	}

	return count;
};

export const sendMail = function(){
	api_sendMail(state.compose.recipient, state.compose.subject, state.compose.body);
	state.compose.recipient = "";
	state.compose.subject = "";
	state.compose.body = "";
};



export const readMail = function(index){
	if (state.mails && state.mails.length){

		var mail = state.mails[index-1];

		//mark as read with api
		if (mail.unread){
			markRead(index);

			//mark read locally
			mail.unread = false;
		}

		return mail;
	}
};

export const reply = function(index){
	var mail = readMail(index);
	state.compose.recipient = mail.sender;
	state.compose.subject = "Re: " + mail.subject;
	state.compose.body = "\n---- Original message ----\n" + mail.body;
	m.route.set("/compose");
};


export const deleteMail = function(index){
	return api_deleteMail(index)
	.then(function(){
		var new_index = 1;
		state.mails = state.mails
		.filter(function(mail){ return mail.index != index; })
		.map(function(mail){
			mail.index = new_index++;
			return mail;
		});
	});
};
