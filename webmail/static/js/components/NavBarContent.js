var NavBarContent = {
  view: function(){
    return [
      m("i", {class:"fa fa-envelope"}),
      m("a", {class:"navbar-brand", href:"#"}, "Minetest webmail"),
      m("div", {class:"navbar-collapse"}, m(NavLinks))
    ];
  }
}
