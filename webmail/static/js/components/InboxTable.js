var InboxTable = {
  view: function(vnode){
    if (!webmail.mails){
      return m("div", "Loading...");
    }

    var head = m("thead", m("tr", [
      m("th", "Sender"),
      m("th", "Subject"),
      m("th", "Sent"),
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
