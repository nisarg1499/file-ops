(function(){

	let express = require("express");
	let path = require("path");
	let fs = require('fs');
	let bodyParser = require('body-parser');

	let app = express();

	app.use(bodyParser.urlencoded({
        extended: true
    }));

	app.use(bodyParser.json());
	app.listen(3000);
	console.log("Server starting on port" + 3000);

	let uploadApi = require("./routes/api-upload.js")(app, express);
	let downloadApi = require("./routes/api-download.js")(app, express);

	app.use("/", uploadApi);
	app.use("/", downloadApi);

})();