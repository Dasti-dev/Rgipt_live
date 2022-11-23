const express = require('express');
const fs = require('fs');
const app = express();

app.get("/", function(req,res){
	res.sendFile(__dirname + "./index.html");
	console.log("ye chl rha hai")
});

app.get("/video", (req,res) => {
	const range = req.headers.range;
	if(!range) {
		res.status(400).send("requires Range header");
		// range = "bytes=0-";
	}

	const videoPath = "./movie_demo.mp4";
	const videoSize = fs.statSync(videoPath).size;
	console.log(videoSize);

	const CHUNK_SIZE = 1 * 1e+6 ;
	const start = Number(range.replace(/\D/g, ""));
	
	
	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

	const contentLength = end - start + 1;
	const headers = {
		"Content-range": `bytes ${start} - ${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4"
	};

	res.writeHead(206, headers);

	const videoStream = fs.createReadStream(videoPath, {start , end});

	videoStream.pipe(res);

});

app.listen(8000, function () {
	console.log("Listening on port 8000 !!!")
});