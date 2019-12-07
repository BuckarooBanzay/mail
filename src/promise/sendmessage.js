

const events = require("../events");

module.exports = (playername, recipient, subject, text) => new Promise(function(resolve){

	events.emit("channel-send", {
		type: "send",
		data: {
			src: playername,
			dst: recipient,
			subject: subject || "",
			body: text || ""
		}
	});

	resolve();
});
