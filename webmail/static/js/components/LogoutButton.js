var LogoutButton = function(){
  return m("button[type=submit]", {
    class:"btn btn-sm btn-block btn-secondary",
    onclick: webmail.service.logout
  }, "Logout");
}
