(function(){

	webmail.routes["/message/:id"] = {
		view: function(){
			if (webmail.loginState.loggedIn)
				return [
					m("div")
				];
			else
				return null;
		}
	};

})();