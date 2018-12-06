(function(){

	var mails = [];

	function fetchMails(){
		m.request({
			url: "api/inbox",
			headers: { "authorization": webmail.token }
		})
		.then(function(result){
			mails = result;
		});
	}

	var InboxRow = {
		view: function(vnode){
			return m("tr", [
				m("td", vnode.attrs.row.sender),
				m("td", vnode.attrs.row.subject),
				m("td", vnode.attrs.row.unread),
				m("td", vnode.attrs.row.body)
			]);
		}
	};

	var InboxTable = {
		oncreate: function(vnode){
			if (!mails.length)
				fetchMails();
		},
		view: function(vnode){
			var head = m("thead", m("tr", [
				m("th", "Sender"),
				m("th", "Subject"),
				m("th", "Status"),
				m("th", "Text")
			]));

			var body = m("tbody", mails.map(function(row){
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
			else {
				//TODO: side-effect
				mails = [];
				return null;
			}
		}
	};

})();