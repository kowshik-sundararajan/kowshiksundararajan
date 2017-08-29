const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;
var app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var user = process.env.GMAIL_USERNAME;
var secret_key = process.env.GMAIL_SECRET_KEY;

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: user,
        pass: secret_key
    }
});


app.get('/', (request, response) => {
    response.render('index.hbs');
});

app.post('/form-submit', (request, response) => {
    
    let senderName = request.body['name'],
        senderEmail = request.body['email'],
        senderMessage = request.body['message'],

    // setup email data with unicode symbols
        mailOptions = {
            from: senderEmail, // sender address
            to: user, // list of receivers
            subject: `New message from ${senderName} on kowshiksundararajan.com`, // Subject line
            text: senderMessage, // plain text body
            html: `<p>Name: <b>${senderName}</b><br />
                    Email: ${senderEmail}</p>
                    <p>Message: ${senderMessage}</p>` // html body
        };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            response.send(error);
            return;
        }
        console.log('* message %s sent: %s', info.messageId, info.response);
        response.send('Your email has been sent, I will get back to you within 24 hours.');
    });

    
});

app.listen(port, () => {
    console.log(`* app started on port ${port}`);
});



