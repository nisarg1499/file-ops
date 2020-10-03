(function(){

	let path = require("path");
	let fs = require('fs');
	let bodyParser = require('body-parser');

	module.exports = downloadApi;

	function downloadApi(app, express){

		var apiRouter = express.Router();

		apiRouter.get("/download", downloadFunction);

		return apiRouter;

		function downloadFunction(req, res){

			var filePath = "fileName";

			var chunkSize = 1024*1024;
			var stats = fs.statSync(filePath);
			var fileSize = stats["size"];

			var chunks = Math.ceil(fileSize/chunkSize);
			var counter = 0;
			var chunkQueue = new Array(chunks).fill().map((_, index)=>index);

			while(counter <= chunks){

				if(!chunkQueue.length){
					console.log("Parts uploaded");
					break;
				}

				let chunkId = chunkQueue.pop();				
				let filePart = counter*chunkSize;
				let sendPart = filePath.slice(filePart, filePart + chunkSize);
				
				console.log(chunkId);

				res.download(filePath ,sendPart);				
			}

			res.status(200).json({message: "Download done"});

			// iterate(chunkQueue, counter, )
		}

		// function iterate(chunkQueue){

		// 	if(!chunkQueue.length){
		// 		console.log("Parts uploaded");
		// 		return;
		// 	}
				
		// 	let chunkId = chunkQueue.pop();
		// 	let filePart = counter*chunkSize;
		// 	let sendPart = filePath.slice(filePart, filePart + chunkSize);

		// 	send(chunk, chunkId)
		// 		.then(() => {
		// 			iterate();
		// 		})
		// 		.catch(() => {
		// 			chunkQueue.push(chunkId);
		// 		})
		// }

	}

})();