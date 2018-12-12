

const events = require("../events");

module.exports = (playername, index) => new Promise(function(resolve, reject){

	events.emit("channel-send", {
		type: "mark-mail-read",
		playername: playername,
		index: +index
	});

	resolve();
});