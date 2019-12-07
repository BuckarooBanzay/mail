(function(){

	var state = webmail.loginState;

	var LoginButton = function(){

		var infoText = m("span", {class:"badge badge-light"}, state.errorMsg ? state.errorMsg : "");
		var spinner = state.busy ? m("i", {class:"fas fa-spinner fa-spin"}) : null;

		return m("button", {
			class:"btn btn-sm btn-block btn-primary",
			disabled: !state.username || !state.password,
			onclick: function(){ webmail.service.login(state.username, state.password); }
		}, [spinner, " Login ", infoText]);
	};

	var LogoutButton = function(){
		return m("button[type=submit]", {
			class:"btn btn-sm btn-block btn-secondary",
			onclick: webmail.service.logout
		}, "Logout");
	};

	var LoginForm = {
		view: function(){
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
	};

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
