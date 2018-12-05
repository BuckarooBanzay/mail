

const events = require("../events");

module.exports = (username, password) => new Promise(function(resolve, reject){

	events.emit("login", {
		name: username,
		password: password
	});

	function handleEvent(result){
		events.removeListener("login-response", handleEvent);
		clearTimeout(handle);
		resolve(result);
	}

	events.on("login-response", handleEvent);

	var handle = setTimeout(function(){
		events.removeListener("login-response", handleEvent);
		reject("mod-comm timeout");
	}, 2500);
});