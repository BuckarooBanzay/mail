var Nav = {
	view: function(vnode){
		return m("nav", {class:"navbar navbar-dark bg-dark fixed-top navbar-expand-lg"}, m(NavBarContent));
	}
}
