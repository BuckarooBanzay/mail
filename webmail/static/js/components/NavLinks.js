function NavLinks(){

  var links = [];

  links.push( m("a", {class:"nav-link", href:"#!/login"}, "Login") );

  if (webmail.loginState.loggedIn){
    links.push( m("a", {class:"nav-link", href:"#!/messages"}, [
        "Messages",
        m("span", {class: "badge badge-light"}, webmail.service.countUnread())
      ])
    );
    links.push( m("a", {class:"nav-link", href:"#!/compose"}, "Compose") );
  }

  return m("ul", {class:"navbar-nav"}, links);
}

function NavBarContent(){
  return [
    m("i", {class:"fa fa-envelope"}),
    m("a", {class:"navbar-brand", href:"#"}, "Minetest webmail"),
    m("div", {class:"navbar-collapse"}, NavLinks())
  ];
}
