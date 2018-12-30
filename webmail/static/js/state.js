(function(){

	var webmail = {
		routes: {},
		token: localStorage["webmail-token"],
		loginState: {
			username: "",
			password: "",
			loggedIn: false,
			errorMsg: "",
			busy: false
		},
		compose: {
			recipient: "",
			subject: "",
			body: ""
		},
		mails: null
	};

	//publish
	window.webmail = webmail;

})();