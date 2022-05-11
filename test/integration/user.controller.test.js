// Default settings
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

// Use should for assert
chai.should();
chai.use(chaiHttp);

// No need to clear each time the database, because the user that i'm creating is also getting deleted on the end
let createdUserId;

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
                emailAdress: 'jake.doe@server.com',
                password: 'Passw0rd'
            })
            .end((req, res) => {
                res.should.be.an('object');
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');

                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('firstName must be a string!');
                done();
            });
    });
    it('TC-201-4 User already exist', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({
                // User is valid
                firstName: 'Henk',
                lastName: 'Tank',
                street: 'Hogeschoollaan 99',
                city: 'Breda',
                emailAdress: 'h.tank@server.com',
                password: 'paSsw00rd'
            })
            .end((req, res) => {
                res.should.be.an('object');
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');

                let { status, message } = res.body;
                status.should.equals(409);
                message.should.be.a('string').that.equals('User already exist!');
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
                emailAdress: 'jake.doe@server.com',
                password: 'Passw0rd'
            })
            .end((req, res) => {
                res.should.be.an('object');
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');

                let { status, result } = res.body;
                status.should.equals(201);
                createdUserId = result.id
                done();
            });
    });
});

describe('UC-204 Details of user', () => {
    it('TC-204-2 User-ID doesnt exist', (done) => {
        chai.request(server)
            .get('/api/user/0')
            .end((req, res) => {
                res.should.be.an('object');
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');

                let { status, message } = res.body;
                status.should.equals(404);
                message.should.be.a('string').that.equals('User does not exist');
                done();
            });
    });
    it('TC-204-3 User-ID exist', (done) => {
        chai.request(server)
            .get('/api/user/' + createdUserId)
            .end((req, res) => {
                res.should.be.an('object');
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');

                let { status, result } = res.body;
                status.should.equals(200);
                done();
            });
    });
});

describe('UC-205 Modify user', () => {
    it('TC-205-1 Required input is missing', (done) => {
        chai.request(server)
            .put('/api/user/1')
            .send({
                firstName: 'Jaxe',
                lastName: 'Doe',
                street: 'Hogeschoollaan 5',
                city: 'Breda',
                // emailAdress is missing
                password: 'Passw0rd',
                phoneNumber: '06 43643761'  
            })
            .end((req, res) => {
                res.should.be.an('object');
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');

                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('emailAdress must be a string!');
                done();
            });
    });
    it('TC-205-4 User doesnt exist', (done) => {
        chai.request(server)
            // User doesnt exist
            .put('/api/user/0')
            .send({
                firstName: 'Jaze',
                lastName: 'Doe',
                street: 'Hogeschoollaan 45',
                city: 'Breda',
                emailAdress: 'jaze.doe@server.com',
                password: 'paSsw0rd',
                phoneNumber: '06 87654321' 
            })
            .end((req, res) => {
                res.should.be.an('object');
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');

                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('User does not exist');
                done();
            });
    });
    it('TC-205-6 User has modified successfully', (done) => {
        chai.request(server)
            .put('/api/user/' + createdUserId)
            .send({
                // User is valid
                firstName: 'Jale',
                lastName: 'Doe',
                street: 'Hogeschoollaan 76',
                city: 'Breda',
                emailAdress: 'jale.doe@server.com',
                password: 'Passw0rd',
                phoneNumber: '06 12425495'  
            })
            .end((req, res) => {
                res.should.be.an('object');
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');

                let { status, result } = res.body;
                status.should.equals(200);
                done();
            });
    });
});

describe('UC-206 Delete user', () => {
    it('TC-206-1 User doesnt exist', (done) => {
        chai.request(server)
            .delete('/api/user/0')
            .end((req, res) => {
                res.should.be.an('object');
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');

                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('User does not exist');
                done();
            });
    });
    it('TC-206-4 User has been deleted successfully', (done) => {
        chai.request(server)
            .delete('/api/user/' + createdUserId)
            .end((req, res) => {
                res.should.be.an('object');
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');

                let { status, message } = res.body;
                status.should.equals(200);
                message.should.be.a('string').that.equals('User has been deleted');
                done();
            });
    });
});