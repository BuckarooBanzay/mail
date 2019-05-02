
var LoginForm = {
	view: function(vnode){
    var state = webmail.loginState;

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
