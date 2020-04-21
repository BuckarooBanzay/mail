import state from './state.js';
import { login, logout } from './service.js';

var LoginButton = function(){

	var infoText = m("span", {class:"badge badge-light"}, state.loginState.errorMsg ? state.loginState.errorMsg : "");
	var spinner = state.loginState.busy ? m("i", {class:"fas fa-spinner fa-spin"}) : null;

	return m("button", {
		class:"btn btn-sm btn-block btn-primary",
		disabled: !state.loginState.username || !state.loginState.password,
		onclick: function(){ login(state.loginState.username, state.loginState.password); }
	}, [spinner, " Login ", infoText]);
};

var LogoutButton = function(){
	return m("button[type=submit]", {
		class:"btn btn-sm btn-block btn-secondary",
		onclick: logout
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
					disabled: state.loginState.loggedIn,
					value: state.loginState.username,
					oninput: function(e){ state.loginState.username = e.target.value; }
				})
			]),
			m("div", {class:"row"}, [
				m("input[type=password]", {
					class:"form-control",
					placeholder:"Password",
					disabled: state.loginState.loggedIn,
					value: state.loginState.password,
					oninput: function(e){ state.loginState.password = e.target.value; }
				})
			]),
			m("div", {class:"row"}, [
				state.loginState.loggedIn ? LogoutButton() : LoginButton()
			])
		];
	}
};

export default {
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
