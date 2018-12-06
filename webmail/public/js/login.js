(function(){

	var state = webmail.loginState;

	if (webmail.token){
		m.request({
			url: "api/verify",
			headers: { "authorization": webmail.token }
		})
		.then(function(result){
			if (result.username){
				state.username = result.username;
				state.loggedIn = true;
			}
		});
	}


	function login(username, password){
		if (!username || !password)
			return;

		state.errorMsg = "";
		state.busy = true;

		m.request({
			method: "POST",
			url: "api/login",
			data: { username: username, password: password }
		})
		.then(function(result){
			state.busy = false;
			if (result.success){
				state.loggedIn = true;
				state.errorMsg = "";

				//save token
				webmail.token = result.token;
				localStorage["webmail-token"] = result.token;
			} else {
				state.errorMsg = "Login failed!";
			}
		})
		.catch(function(err){
			state.errorMsg = "System error!";
			state.busy = false;
		})

	}

	function logout(){
		state.loggedIn = false;
		
		//clear token
		webmail.token = null;
		delete localStorage["webmail-token"];
	}

	var LoginButton = function(){

		var infoText = m("span", {class:"badge badge-light"}, state.errorMsg ? state.errorMsg : "");
		var spinner = state.busy ? m("i", {class:"fas fa-spinner fa-spin"}) : null;

		return m("button", {
			class:"btn btn-sm btn-block btn-primary",
			disabled: !state.username || !state.password,
			onclick: function(){ login(state.username, state.password); }
		}, [spinner, " Login ", infoText]);
	}

	var LogoutButton = function(){
		return m("button[type=submit]", {
			class:"btn btn-sm btn-block btn-secondary",
			onclick: function(){ logout(); }
		}, "Logout");
	}

	var LoginForm = {
		view: function(vnode){
			return [
				m("div", {class:"row"}, [
					m("h3", "Webmail login")
				]),
				m("div", {class:"row"}, [
					m("input[type=text]", {
						class:"form-control",
						placeholder:"Playername",
						disabled: state.loggedIn,
						value: state.username,
						oninput: function(e){ state.username = e.target.value; }
					})
				]),
				m("div", {class:"row"}, [
					m("input[type=password]", {
						class:"form-control",
						placeholder:"Password",
						disabled: state.loggedIn,
						value: state.password,
						oninput: function(e){ state.password = e.target.value; }
					})
				]),
				m("div", {class:"row"}, [
					state.loggedIn ? LogoutButton() : LoginButton()
				])
			];
		}
	}

	webmail.routes["/login"] = {
		view: function(){
			return [
				m("div", {class:"row"}, [
					m("div", {class:"col-md-4"}),
					m("form", {class:"col-md-4"}, m(LoginForm)),
					m("div", {class:"col-md-4"})
				])
			];
		}
	};

})();