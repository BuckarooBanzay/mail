
var routes = {
  "/login": {
    view: function(){
      return [
        m("div", {class:"row"}, [
          m("div", {class:"col-md-4"}),
          m("form", {class:"col-md-4"}, m(LoginForm)),
          m("div", {class:"col-md-4"})
        ])
      ];
    }
  },


  "/compose": {
		view: function(){
			if (webmail.loginState.loggedIn)
				return m("div", {class:"row"}, [
					m("div", {class:"col-md-2"}),
					m("form", {class:"col-md-8"}, m(Compose)),
					m("div", {class:"col-md-2"})
				])

			else
				return null;
		}
	},

  "/messages": {
		view: function(){
			if (webmail.loginState.loggedIn)
				return m(InboxTable);
			else
				return null;
		}
	},

  "/message/:id": MessageDetail

}
