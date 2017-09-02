var request = require('supertest');
const expect = require('expect');

var app = require('./server.js').app;

describe('Server', () => {
    
    describe('#GET /', () => {
        it('should load index.hbs', (done) => {
            request(app)
            .get('/')
            .expect(200)
            .end(done);
        })
    });
})
