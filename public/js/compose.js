import state from './state.js';
import { sendMail } from './service.js';

const Compose = {
	view: function(){
		return [
			m("div", {class:"row"}, [
				m("input[type=text]", {
					class:"form-control",
					placeholder:"Recipient",
					value: state.compose.recipient,
					oninput: function(e){ state.compose.recipient = e.target.value; }
				})
			]),
			m("div", {class:"row"}, [
				m("input[type=text]", {
					class:"form-control",
					placeholder:"Subject",
					value: state.compose.subject,
					oninput: function(e){ state.compose.subject = e.target.value; }
				})
			]),
			m("div", {class:"row"}, [
				m("textarea", {
					class:"form-control",
					placeholder:"Text",
					style: "height: 300px;",
					value: state.compose.body,
					oninput: function(e){ state.compose.body = e.target.value; }
				})
			]),
			m("div", {class:"row"}, [
				m("a", {
					class:"btn btn-sm btn-block btn-primary",
					onclick: sendMail,
					disabled: !state.compose.body || !state.compose.subject || !state.compose.recipient,
					onsubmit: function(e) { e.preventDefault(); }
				}, "Submit")
			])
		];
	}
};

export default {
	view: function(){
		if (state.loginState.loggedIn)
			return m("div", {class:"row"}, [
				m("div", {class:"col-md-2"}),
				m("form", {class:"col-md-8"}, m(Compose)),
				m("div", {class:"col-md-2"})
			]);

		else
			return null;
	}
};
