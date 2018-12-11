(function(){


	var InboxRow = {
		view: function(vnode){
			function openMail(){
				m.route.set("/message/:id", { id: vnode.attrs.row.index });
			}

			var timeStr = "";

			if (vnode.attrs.row.time){
				var time_m = moment(vnode.attrs.row.time * 1000);
				var durationStr = moment.duration(time_m - moment()).humanize(true);

				timeStr = time_m.format("YYYY-MM-DD HH:mm:ss") + " (" + durationStr + ")";
			}

			return m("tr", [
				m("td", vnode.attrs.row.sender),
				m("td", vnode.attrs.row.subject),
				m("td", timeStr),
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
		view: function(vnode){
			if (!webmail.mails){
				return m("div", "Loading...");
			}

			var head = m("thead", m("tr", [
				m("th", "Sender"),
				m("th", "Subject"),
				m("th", "Sent"),
				m("th", "Status"),
				m("th", "Action")
			]));

			var body = m("tbody", webmail.mails.map(function(row){
				return m(InboxRow, {row: row});
			}));

			return m("table",
				{class:"table table-condensed table-striped table-sm"},
				[head, body]
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