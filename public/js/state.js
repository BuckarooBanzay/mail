
const state = {
	routes: {},
	token: localStorage["webmail-token"],
	loginState: {
		username: "",
		password: "",
		loggedIn: false,
		errorMsg: "",
		busy: false
	},
	compose: {
		recipient: "",
		subject: "",
		body: ""
	},
	mails: null
};

export default state;
