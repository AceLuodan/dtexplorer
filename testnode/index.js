const express = require('express')
const app = express()

app.use(express.static('public'));
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/test', (req, res) => res.send(' test Hello World!'))
app.get('/test/1', (req, res) => res.send(' test 1 Hello World!'))
app.get('/test/2', (req, res) => res.send(' test 2 Hello World!'))

app.listen(3000, () => console.log('http listening on port 3000!'));
