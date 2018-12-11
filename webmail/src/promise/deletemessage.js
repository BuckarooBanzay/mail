

const events = require("../events");

module.exports = (playername, index) => new Promise(function(resolve, reject){

	events.emit("channel-send", {
		type: "delete-mail",
		playername: playername,
		index: +index
	});

	resolve();
});