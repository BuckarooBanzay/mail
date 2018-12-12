(function(state){

var service = {};

//verify token if available
if (webmail.token){
	webmail.api.verifyToken()
	.then(function(result){
		if (result.username){
			state.username = result.username;
			state.loggedIn = true;
			//fetch messages after token alright
			service.fetchMails();
		}
	});
}


service.login = function(username, password){
	if (!username || !password)
		return;

	state.errorMsg = "";
	state.busy = true;

	webmail.api.login(username, password)
	.then(function(result){
		state.busy = false;
		if (result.success){
			state.loggedIn = true;
			state.errorMsg = "";

			//save token
			webmail.token = result.token;
			localStorage["webmail-token"] = result.token;

			//fetch mails after login
			service.fetchMails();
		} else {
			state.errorMsg = "Login failed!";
		}
	})
	.catch(function(err){
		state.errorMsg = "System error!";
		state.busy = false;
	});
}

service.logout = function(){
	state.loggedIn = false;
	webmail.mails = [];
	
	//clear token
	webmail.token = null;
	delete localStorage["webmail-token"];
}

service.fetchMails = function(){
	if (!webmail.mails || !webmail.mails.length){
		webmail.api.fetchMails()
		.then(function(result){
			webmail.mails = result;
		});
	}
}

service.countUnread = function(){
	var count = 0;
	if (webmail.mails && webmail.mails.length){
		webmail.mails.forEach(function(mail){
			if (mail.unread)
				count++;
		});
	}

	return count;
}

service.readMail = function(index){
	if (webmail.mails && webmail.mails.length){
		//mark as read with api
		webmail.api.markRead(index);

		//mark read locally
		var mail = webmail.mails[index-1];
		mail.unread = false;

		return mail;
	}
}

service.deleteMail = function(index){
	return webmail.api.deleteMail(index)
	.then(function(){
		var new_index = 1;
		webmail.mails = webmail.mails
		.filter(function(mail){ return mail.index != index; })
		.map(function(mail){
			mail.index = new_index++;
			return mail;
		});
	});
}



webmail.service = service;

})(webmail.loginState);