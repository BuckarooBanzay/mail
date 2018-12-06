

const events = require("../events");

module.exports = (playername) => new Promise(function(resolve, reject){

	events.emit("channel-send", {
		type: "player-messages",
		data: playername
	});

	function handleEvent(result){
		if (result.type == "player-messages" && result.playername == playername){
			events.removeListener("channel-recv", handleEvent);
			clearTimeout(handle);
			resolve(result.data);
		}
	}

	events.on("channel-recv", handleEvent);

	var handle = setTimeout(function(){
		events.removeListener("channel-recv", handleEvent);
		reject("mod-comm timeout");
	}, 1000);
});