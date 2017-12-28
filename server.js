const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const helmet = require('helmet');
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
var app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.locals.nonce = uuid.v4()
  next();
})

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'www.google-analytics.com'],
    styleSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'www.google-analytics.com'],
    fontSrc: ["'self'", 'fonts.gstatic.com data:'],
    scriptSrc: ["'self'", 'www.google-analytics.com', 'www.googletagmanager.com', (req, res) => {
      return `nonce-${res.locals.nonce}`;
    }]
  }
}));
app.use(helmet.hsts({
  // Must be at least 18 weeks to be approved by Google
  maxAge: 31536000,

  // Must be enabled to be approved by Google
  includeSubDomains: true,
  preload: true
}));

app.get('/', (request, response) => {
  const structuredData = `<script type="application/ld+json" nonce="${response.locals.nonce}">
  	{
  		"@context": "https://schema.org",
  		"@type": "Person",
  		"name": "Kowshik Sundararajan",
  		"description": "Web Developer & Animal Rights Activist",
  		"url": "https://www.kowshiksundararajan.com",
  		"jobTitle": "National University of Singapore",
  		"gender": "non-binary",
  		"image": "https://www.kowshiksundararajan.com/images/favicon.ico",
  		"sameAs": [
  				"https://www.linkedin.com/in/kowshik-sundararajan/",
  				"https://github.com/kowshik-sundararajan",
  				"https://www.facebook.com/activistkow",
  				"https://twitter.com/therowdykowdy"
  		]
  	}
  </script>`;
  response.render('index.hbs', {
    structuredData,
    nonce: response.locals.nonce
  });
});


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
