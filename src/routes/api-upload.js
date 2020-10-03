(function(){

	let path = require("path");
	let fs = require('fs');
	let bodyParser = require('body-parser');

	module.exports = uploadApi;

	function uploadApi(app, express){

		let array = {};
		var apiRouter = express.Router();

		apiRouter.post("/upload", uploadFunction);
		apiRouter.get("/init", initialFunction);

		return apiRouter;

		function uploadFunction(req, res){

			let uniqueId = req.headers['id'];
			let startByte = parseInt(req.headers['x-start-byte'], 10);
			var name = req.headers['name'];
			let fileSize = parseInt(req.headers['size'], 10);

			console.log(uniqueId, name, fileSize);

			if(!uniqueId){
				console.log("No id");
				res.end(400);
			}

			if(!array[uniqueId]){
				array[uniqueId] = {};
			}
			let uploadInfo = array[uniqueId];
			if(!startByte){
				uploadInfo.bytesReceived = 0;
				fileStream = fs.createWriteStream(`./{name}`, {flags: 'w'});
			}
			else{
				file = fs.createWriteStream(`./{name}`, {
					flags: 'a'
				});
			}

			req.on('data', function(obj){
				uploadInfo.bytesReceived += obj.length;
			});

			req.pipe(fileStream);

			fileStream.on('close', function(){

				if(uploadInfo.bytesReceived == fileSize){
					console.log("File uploaded");
					delete array[uniqueId];

					res.status(200).json({message: "File uploaded"});
				}
				else{
					console.log("upload interrupted at " + uploadInfo.bytesReceived + " bytes");
					res.status(400).json({message: "interrupted"});
				}
			});
		}	

		function initialFunction(req, res){
			let uniqueId = req.headers['id'];
			let name = req.headers['name'];
			let fileSize = parseInt(req.headers['size'], 10);

			if(name){
				let details = fs.statSync(name);
				if(details){
					if(fileSize == details.size){
						res.status(200).send({message: "File already present"});
					}
					if(!array[uniqueId]){
						array[uniqueId] = {}
						array[uniqueId]['bytesReceived'] = details.size;
					}
				}
			}
			let uploadInfo = array[uniqueId];
			if(uploadInfo){
				res.status(200).json({message: "uploaded bytes"});
			}
			else{
				res.status(400).json({message: "0 bytes uploaded"});
			}
		}
	}
})();