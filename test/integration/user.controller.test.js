// Default settings
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

// Use should for assert
chai.should();
chai.use(chaiHttp);

// Create the tests
describe('UC-201 Register as new user', () => {
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
                password: 'Passw0rd',
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
    it('TC-201-2 Email address is not valid', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({
                firstName: 'Jake',
                lastName: 'Doe',
                street: 'Hogeschoollaan 54',
                city: 'Breda',
                isActive: true,
                // emailAdress is not valid
                emailAdress: 'jake.doeserver.com',
                password: 'Passw0rd',
                phoneNumber: '06 43643761'  
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be.a('string').that.equals('emailAdress is not valid!');
                done();
            });
    });
    it('TC-201-3 Password is not valid', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({
                firstName: 'Jake',
                lastName: 'Doe',
                street: 'Hogeschoollaan 54',
                city: 'Breda',
                isActive: true,
                emailAdress: 'jake.doe@server.com',
                // password not valid
                password: 'password',
                phoneNumber: '06 43643761'  
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be.a('string').that.equals('password is not valid!');
                done();
            });
    });
    it('TC-201-4 User already exists', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                street: 'Hogeschoollaan 32',
                city: 'Breda',
                isActive: true,
                emailAdress: 'jane.doe@server.com',
                password: 'paSsw0rd',
                phoneNumber: '06 87654321' 
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be.a('string').that.equals('User already exists!');
                done();
            });
    });
    it('TC-201-5 User has registered successfully', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({
                // User is valid
                firstName: 'Jake',
                lastName: 'Doe',
                street: 'Hogeschoollaan 54',
                city: 'Breda',
                isActive: true,
                emailAdress: 'jake.doe@server.com',
                password: 'Passw0rd',
                phoneNumber: '06 43643761'  
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status } = res.body;
                status.should.equals(201);
                done();
            });
    });
});