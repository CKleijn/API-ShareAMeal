// Default settings
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

// Create a database array
let database = [];

// Use should for assert
chai.should();
chai.use(chaiHttp);

// Create the tests
describe('UC-201 Register as new user', () => {
    beforeEach((done) => {
        database = [];
        done();
    });
    it('TC-201-1 Required input is missing', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({
                // firstName is missing
                lastName: 'Doe',
                street: 'Hogeschoollaan 54',
                city: 'Breda',
                isActive: true,
                emailAdress: 'jake.doe@server.com',
                password: 'public',
                phoneNumber: '06 43643761'  
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be.a('string').that.equals('firstName must be a string!');
                done();
            });
    });
    it('TC-201-2 Email address is not unique', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                street: 'Hogeschoollaan 54',
                city: 'Breda',
                isActive: true,
                // emailAdress is not unique
                emailAdress: 'jane.doe@server.com',
                password: 'public',
                phoneNumber: '06 43643761'  
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status, result } = res.body;
                status.should.equals(409);
                result.should.be.a('string').that.equals('jane.doe@server.com is not unique');
                done();
            });
    });
});