

if (!process.env.WEBMAILKEY){
	throw new Error("WEBMAILKEY env var not found!");
}

const app = require("./app");
require("./api");

app.listen(8080, () => console.log('Listening on http://127.0.0.1:8080'));
