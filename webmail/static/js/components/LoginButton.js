var LoginButton = function(){
  var state = webmail.loginState;
  
  var infoText = m("span", {class:"badge badge-light"}, state.errorMsg ? state.errorMsg : "");
  var spinner = state.busy ? m("i", {class:"fas fa-spinner fa-spin"}) : null;

  return m("button", {
    class:"btn btn-sm btn-block btn-primary",
    disabled: !state.username || !state.password,
    onclick: function(){ webmail.service.login(state.username, state.password); }
  }, [spinner, " Login ", infoText]);
}
