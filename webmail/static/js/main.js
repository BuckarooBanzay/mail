m.route(document.getElementById("app"), "/login", routes);

m.mount(document.getElementById("nav"), {
	view: function(vnode){
		return m("nav", {class:"navbar navbar-dark bg-dark fixed-top navbar-expand-lg"}, NavBarContent());
	}
});
