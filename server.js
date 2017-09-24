const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (request, response) => {
    response.render('index.hbs');
});

app.get('/resume', (request, response) => {
    var data = fs.readFileSync('./public/Kowshik_Sundararajan_Resume.pdf');
    // response.setHeader('Kowshik Sundararajan CV');
    response.contentType('application/pdf');
    response.send(data);
})

app.listen(port, () => {
    console.log(`* app started on port ${port}`);
});

module.exports.app = app;



