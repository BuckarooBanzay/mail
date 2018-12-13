(function(){

	var state = webmail.compose;

	var Compose = {
		view: function(vnode){
			return [
				m("div", {class:"row"}, [
					m("input[type=text]", {
						class:"form-control",
						placeholder:"Recipient",
						value: state.recipient,
						oninput: function(e){ state.recipient = e.target.value; }
					})
				]),
				m("div", {class:"row"}, [
					m("input[type=text]", {
						class:"form-control",
						placeholder:"Subject",
						value: state.subject,
						oninput: function(e){ state.subject = e.target.value; }
					})
				]),
				m("div", {class:"row"}, [
					m("textarea", {
						class:"form-control",
						placeholder:"Text",
						style: "height: 300px;",
						value: state.body,
						oninput: function(e){ state.body = e.target.value; }
					})
				]),
				m("div", {class:"row"}, [
					m("button[type=submit]", {
						class:"btn btn-sm btn-block btn-primary",
						onclick: webmail.service.sendMail,
						disabled: !state.body || !state.subject || !state.recipient
					}, "Submit")
				])
			];
		}
	};


	webmail.routes["/compose"] = {
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
	};



})();