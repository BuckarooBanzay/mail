
(function(){

	function NavLinks(){
		return m("ul", {class:"navbar-nav"}, [
			m("a", {class:"nav-link", href:"#!/login"}, "Login"),
			m("a", {class:"nav-link", href:"#!/messages"}, [
				"Messages",
				m("span", {class: "badge badge-light"}, webmail.service.countUnread())
			])
		]);
	}

	function NavBarContent(){
		return [
			m("i", {class:"fa fa-envelope"}),
			m("a", {class:"navbar-brand", href:"#"}, "Minetest webmail"),
			m("div", {class:"navbar-collapse"}, NavLinks())
		];
	}

	m.mount(document.getElementById("nav"), {
		view: function(vnode){
			return m("nav", {class:"navbar navbar-dark bg-dark fixed-top navbar-expand-lg"}, NavBarContent());
		}
	});


})();

