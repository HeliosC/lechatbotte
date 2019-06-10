const express = require('express');
const fs = require('fs');
const app = express();
const port = 80;

app.use(express.static('public'));

// Global route
app.get('*', function(req, res) {
	let path = __dirname + '/public/' + req.url;
	fs.access(path, (err) => {
		if(err) {
			// if file does not exist, go to the main page
			return res.sendFile(__dirname + '/public/index.html');
		} else {
			// else return the asked file
			res.sendFile(path);
		}
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
