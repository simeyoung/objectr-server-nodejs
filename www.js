const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const PORT = 7000;

console.log('[SERVER] server starting...');
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT);