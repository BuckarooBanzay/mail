(function(){

	function fetchMails(){
		m.request({
			url: "api/inbox",
			headers: { "authorization": webmail.token }
		})
		.then(function(result){
			// add lua index on mail
			var i = 1;
			webmail.mails = result.map(function(mail){
				mail.index = i++;
				return mail;
			});
		});
	}


	var InboxRow = {
		view: function(vnode){
			function openMail(){
				m.route.set("/message/:id", { id: vnode.attrs.row.index });
			}

			return m("tr", [
				m("td", vnode.attrs.row.sender),
				m("td", vnode.attrs.row.subject),
				m("td", vnode.attrs.row.unread),
				m("td", [
					m("div", { class: "btn-group" }, [
						m("button[type=button]", { class: "btn btn-primary", onclick: openMail }, "Open"),
						m("button[type=button]", { class: "btn btn-secondary" }, "Mark unread"),
						m("button[type=button]", { class: "btn btn-secondary" }, "Mark read"),
						m("button[type=button]", { class: "btn btn-danger" }, "Remove")
					])
				])
			]);
		}
	};

	var InboxTable = {
		oncreate: function(vnode){
			if (!webmail.mails.length)
				fetchMails();
		},
		view: function(vnode){
			var head = m("thead", m("tr", [
				m("th", "Sender"),
				m("th", "Subject"),
				m("th", "Status"),
				m("th", "Action")
			]));

			var body = m("tbody", webmail.mails.map(function(row){
				return m(InboxRow, {row: row});
			}));

			return m("table",
				{class:"table table-condensed table-striped table-sm"},
				[head,body]
			);
		}
	};


	webmail.routes["/messages"] = {
		view: function(){
			if (webmail.loginState.loggedIn)
				return [
					m("div"),
					m(InboxTable)
				];
			else
				return null;
		}
	};

})();