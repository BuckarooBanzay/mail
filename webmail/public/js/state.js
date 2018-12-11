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
		mails: null
	};

	//publish
	window.webmail = webmail;

})();