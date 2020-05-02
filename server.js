
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(express.static('public'));

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
