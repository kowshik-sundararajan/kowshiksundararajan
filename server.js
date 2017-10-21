const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');

const port = process.env.PORT || 3000;
var app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'fonts.googleapis.com'],
    fontSrc: ["'self'", 'fonts.gstatic.com data:', 'fonts.googleapis.com'],
    scriptSrc: ["'self'", 'fonts.googleapis.com', 'code.jquery.com']
  }
}));
app.use(helmet.hsts({
  // Must be at least 18 weeks to be approved by Google
  maxAge: 31536000,

  // Must be enabled to be approved by Google
  includeSubDomains: true,
  preload: true
}));

var _underProgess = true;

if (_underProgess) {
    app.get('/', (request, response) => {
        response.render('not-ready.hbs');
    });
} else {
    app.get('/', (request, response) => {
        response.render('index.hbs');
    }); 
}


app.get('/resume', (request, response) => {
    var data = fs.readFileSync('./public/Kowshik_Sundararajan_Resume.pdf');
    response.contentType('application/pdf');
    response.send(data);
});


app.use((request, response) => {
  response.status(404).render('404.hbs');
});


app.use((err, request, response) => {
  console.error(err.stack)
  response.status(500).send('Something broke!')
});


app.listen(port, () => {
    console.log(`* app started on port ${port}`);
});


module.exports.app = app;



