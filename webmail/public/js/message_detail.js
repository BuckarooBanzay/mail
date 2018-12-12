(function(){

	webmail.routes["/message/:id"] = {
		view: function(){
			if (!webmail.mails)
				return m("div", "Loading...");

			var id = m.route.param("id");
			var mail = webmail.service.readMail(id);

			console.log(mail);//XXX

			return [
				m("div")
			];
		}
	};

})();