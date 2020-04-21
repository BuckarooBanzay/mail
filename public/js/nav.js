import state from './state.js';
import { countUnread } from './service.js';

function NavLinks(){

	var links = [];

	links.push( m("a", {class:"nav-link", href:"#!/login"}, "Login") );

	if (state.loginState.loggedIn){
		links.push( m("a", {class:"nav-link", href:"#!/messages"}, [
				"Messages",
				m("span", {class: "badge badge-light"}, countUnread())
			])
		);
		links.push( m("a", {class:"nav-link", href:"#!/compose"}, "Compose") );
	}

	return m("ul", {class:"navbar-nav"}, links);
}

function NavBarContent(){
	return m("div", {class:"container"}, [
		m("i", {class:"fa fa-envelope"}),
		m("a", {class:"navbar-brand", href:"#"}, "Minetest webmail"),
		m("div", {class:"navbar-collapse"}, NavLinks())
	]);
}

export default {
	view: function(){
		return m("nav", {class:"navbar navbar-dark bg-dark fixed-top navbar-expand-lg"}, NavBarContent());
	}
};
