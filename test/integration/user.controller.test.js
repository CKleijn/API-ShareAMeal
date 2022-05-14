process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb';
// Default settings
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const dbconnection = require('./../../database/dbconnection');
const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../../src/config/config');

// Use should for assert
chai.should();
chai.use(chaiHttp);

const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;';
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;';
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;';
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE;

const INSERT_MEALS = 'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' + '(1, "Meal A", "description", "image url", 5, 6.50, 1),' + '(2, "Meal B", "description", "image url", 5, 6.50, 1);';
const INSERT_USER = 'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`) VALUES' + '(1, "first", "last", "test@server.nl", "secret", "street", "city");';
const INSERT_SECOND_USER = 'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`) VALUES' + '(2, "first2", "last2", "test2@server.nl", "secret", "street2", "city2");';

// Create the tests
describe('UC-201 Register as new user', () => {
    beforeEach((done) => {
        dbconnection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(CLEAR_DB + INSERT_USER + INSERT_SECOND_USER + INSERT_MEALS, (err, results, fields) => {
                if (err) throw err;
                connection.release();
                done();
            });
        });
    });
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
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');
                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('firstName must be a string!');
                done();
            });
    });
    // it('TC-201-2 Email address is not valid', (done) => {
    //     chai.request(server)
    //         .post('/api/user')
    //         .send({
    //             firstName: 'Jake',
    //             lastName: 'Doe',
    //             street: 'Hogeschoollaan 54',
    //             city: 'Breda',
    //             // emailAdress is not valid
    //             emailAdress: 'jake.doeserver.com',
    //             password: 'Passw0rd',
    //             phoneNumber: '06 43643761'  
    //         })
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, message } = res.body;
    //             status.should.equals(400);
    //             message.should.be.a('string').that.equals('emailAdress is not valid!');
    //             done();
    //         });
    // });
    // it('TC-201-3 Password is not valid', (done) => {
    //     chai.request(server)
    //         .post('/api/user')
    //         .send({
    //             firstName: 'Jake',
    //             lastName: 'Doe',
    //             street: 'Hogeschoollaan 54',
    //             city: 'Breda',
    //             emailAdress: 'jake.doe@server.com',
    //             // password not valid
    //             password: 'password',
    //             phoneNumber: '06 43643761'  
    //         })
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, message } = res.body;
    //             status.should.equals(400);
    //             message.should.be.a('string').that.equals('password is not valid!');
    //             done();
    //         });
    // });
    it('TC-201-4 User already exist', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({
                // User is valid
                firstName: 'first',
                lastName: 'last',
                street: 'street',
                city: 'city',
                emailAdress: 'test@server.nl',
                password: 'secret'
            })
            .end((req, res) => {
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
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message', 'result');
                let { status, message, result } = res.body;
                status.should.equals(201);
                message.should.be.a('string').that.equals('User has been created!');
                result.should.have.property('id');
                result.should.have.property('firstName');
                result.should.have.property('lastName');
                result.should.have.property('isActive');
                result.should.have.property('street');
                result.should.have.property('city');
                result.should.have.property('emailAdress');
                result.should.have.property('password');
                result.should.have.property('phoneNumber');
                result.should.have.property('roles');
                done();
            });
    });
});

describe('UC-202 Overview of users', () => {
    beforeEach((done) => {
        dbconnection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(CLEAR_DB + INSERT_USER + INSERT_SECOND_USER + INSERT_MEALS, (err, results, fields) => {
                if (err) throw err;
                connection.release();
                done();
            });
        });
    });
    it('TC-202-1 Show zero users', (done) => {
        chai.request(server)
            .get('/api/user')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .query({limit: 0})
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');
                let { status, result } = res.body;
                status.should.equals(200);
                result.should.be.an('array');
                result.should.have.length(0);
                done();
            });
    });
    it('TC-202-2 Show two users', (done) => {
        chai.request(server)
            .get('/api/user')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .query({limit: 2})
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');
                let { status, result } = res.body;
                status.should.equals(200);
                result.should.be.an('array');
                result.should.have.length(2);
                result.forEach(user => {
                    user.should.have.property('id');
                    user.should.have.property('firstName');
                    user.should.have.property('lastName');
                    user.should.have.property('isActive');
                    user.should.have.property('street');
                    user.should.have.property('city');
                    user.should.have.property('emailAdress');
                    user.should.have.property('password');
                    user.should.have.property('phoneNumber');
                    user.should.have.property('roles'); 
                });
                done();
            });
    });
    it('TC-202-3 Show users with search term by non-existent name', (done) => {
        chai.request(server)
            .get('/api/user')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .query({firstName: 'Jonas'})
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');
                let { status, result } = res.body;
                status.should.equals(200);
                result.should.be.an('array');
                result.should.have.length(0);
                done();
            });
    });
    it('TC-202-4 Show users using the search term in the field isActive = false', (done) => {
        chai.request(server)
            .get('/api/user')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .query({isActive: 'false'})
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');
                let { status, result } = res.body;
                status.should.equals(200);
                result.should.be.an('array');
                result.forEach(user => {
                    user.should.have.property('id');
                    user.should.have.property('firstName');
                    user.should.have.property('lastName');
                    user.should.have.property('isActive');
                    user.should.have.property('street');
                    user.should.have.property('city');
                    user.should.have.property('emailAdress');
                    user.should.have.property('password');
                    user.should.have.property('phoneNumber');
                    user.should.have.property('roles'); 
                });
                done();
            });
    });
    it('TC-202-5 Show users using the search term in the field isActive = true', (done) => {
        chai.request(server)
            .get('/api/user')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .query({isActive: 'true'})
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');
                let { status, result } = res.body;
                status.should.equals(200);
                result.should.be.an('array');
                result.forEach(user => {
                    user.should.have.property('id');
                    user.should.have.property('firstName');
                    user.should.have.property('lastName');
                    user.should.have.property('isActive');
                    user.should.have.property('street');
                    user.should.have.property('city');
                    user.should.have.property('emailAdress');
                    user.should.have.property('password');
                    user.should.have.property('phoneNumber');
                    user.should.have.property('roles'); 
                });
                done();
            });
    });
    it('TC-202-6 Show users with search term by existing name', (done) => {
        chai.request(server)
            .get('/api/user')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .query({firstName: 'Jake'})
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');
                let { status, result } = res.body;
                status.should.equals(200);
                result.should.be.an('array');
                result.forEach(user => {
                    user.should.have.property('id');
                    user.should.have.property('firstName');
                    user.should.have.property('lastName');
                    user.should.have.property('isActive');
                    user.should.have.property('street');
                    user.should.have.property('city');
                    user.should.have.property('emailAdress');
                    user.should.have.property('password');
                    user.should.have.property('phoneNumber');
                    user.should.have.property('roles'); 
                });
                done();
            });
    });
});

describe('UC-203 User profile request', () => {
    beforeEach((done) => {
        dbconnection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(CLEAR_DB + INSERT_USER + INSERT_SECOND_USER + INSERT_MEALS, (err, results, fields) => {
                if (err) throw err;
                connection.release();
                done();
            });
        });
    });
    it('TC-203-1 Invalid token', (done) => {
        chai.request(server)
            .get('/api/user/profile')
            // Invalid token
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, 'invalidToken')
            )
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');
                let { status, message } = res.body;
                status.should.equals(401);
                message.should.be.a('string').that.equals('Invalid token!');
                done();
            });
    });
    it('TC-203-2 Valid token and user exists', (done) => {
        chai.request(server)
            .get('/api/user/profile')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');
                let { status, result } = res.body;
                status.should.equals(200);
                result.should.have.property('id');
                result.should.have.property('firstName');
                result.should.have.property('lastName');
                result.should.have.property('isActive');
                result.should.have.property('street');
                result.should.have.property('city');
                result.should.have.property('emailAdress');
                result.should.have.property('password');
                result.should.have.property('phoneNumber');
                result.should.have.property('roles');
                done();
            });
    });
});

describe('UC-204 Details of user', () => {
    beforeEach((done) => {
        dbconnection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(CLEAR_DB + INSERT_USER + INSERT_SECOND_USER + INSERT_MEALS, (err, results, fields) => {
                if (err) throw err;
                connection.release();
                done();
            });
        });
    });
    it('TC-204-1 Invalid token', (done) => {
        chai.request(server)
            .put('/api/user/1')
            // Invalid token
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, 'invalidToken')
            )
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');
                let { status, message } = res.body;
                status.should.equals(401);
                message.should.be.a('string').that.equals('Invalid token!');
                done();
            });
    });
    it('TC-204-2 User-ID doesnt exist', (done) => {
        chai.request(server)
            // User-ID doesnt exist
            .get('/api/user/0')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .end((req, res) => {
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
            .get('/api/user/1')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'result');
                let { status, result } = res.body;
                status.should.equals(200);
                result.should.have.property('id');
                result.should.have.property('firstName');
                result.should.have.property('lastName');
                result.should.have.property('isActive');
                result.should.have.property('street');
                result.should.have.property('city');
                result.should.have.property('emailAdress');
                result.should.have.property('password');
                result.should.have.property('phoneNumber');
                result.should.have.property('roles');
                done();
            });
    });
});

describe('UC-205 Modify user', () => {
    beforeEach((done) => {
        dbconnection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(CLEAR_DB + INSERT_USER + INSERT_SECOND_USER + INSERT_MEALS, (err, results, fields) => {
                if (err) throw err;
                connection.release();
                done();
            });
        });
    });
    it('TC-205-1 Required input is missing', (done) => {
        chai.request(server)
            .put('/api/user/1')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .send({
                // emailAdress is missing
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
    // it('TC-205-3 Phone number is not valid', (done) => {
    //     chai.request(server)
    //         .put('/api/user/1')
    //         .send({
    //             firstName: 'Jaze',
    //             lastName: 'Doe',
    //             street: 'Hogeschoollaan 45',
    //             city: 'Breda',
    //             isActive: true,
    //             emailAdress: 'jaze.doe@server.com',
    //             password: 'Passw0rd',
    //             // phoneNumber is not valid
    //             phoneNumber: '06 4364'  
    //         })
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, message } = res.body;
    //             status.should.equals(400);
    //             message.should.be.a('string').that.equals('phoneNumber is not valid!');
    //             done();
    //         });
    // });
    it('TC-205-4 User doesnt exist', (done) => {
        chai.request(server)
            // User doesnt exist
            .put('/api/user/0')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .send({
                emailAdress: 'jake.doe@server.com'
            })
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');
                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('User does not exist');
                done();
            });
    });
    it('TC-205-5 Not logged in', (done) => {
        chai.request(server)
            .put('/api/user/1')
            // User is not logged in
            .send({
                emailAdress: 'jake.doe@server.com'
            })
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message')
                let { status, message } = res.body;
                status.should.equals(401);
                message.should.be.a('string').that.equals('Not logged in!');
                done();
            });
    });
    it('TC-205-6 User has modified successfully', (done) => {
        chai.request(server)
            .put('/api/user/1')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .send({
                // User is valid
                emailAdress: 'jake.doe@server.com'
            })
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message', 'result');
                let { status, message, result } = res.body;
                status.should.equals(200);
                message.should.be.a('string').that.equals('User has been updated!');
                result.should.have.property('id');
                result.should.have.property('firstName');
                result.should.have.property('lastName');
                result.should.have.property('isActive');
                result.should.have.property('street');
                result.should.have.property('city');
                result.should.have.property('emailAdress');
                result.should.have.property('password');
                result.should.have.property('phoneNumber');
                result.should.have.property('roles');
                done();
            });
    });
});

describe('UC-206 Delete user', () => {
    beforeEach((done) => {
        dbconnection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(CLEAR_DB + INSERT_USER + INSERT_SECOND_USER + INSERT_MEALS, (err, results, fields) => {
                if (err) throw err;
                connection.release();
                done();
            });
        });
    });
    it('TC-206-1 User doesnt exist', (done) => {
        chai.request(server)
            // User doesnt exist
            .delete('/api/user/0')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');
                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('User does not exist');
                done();
            });
    });
    it('TC-206-2 Not logged in', (done) => {
        chai.request(server)
            .delete('/api/user/1')
            // Not logged in
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message')
                let { status, message } = res.body;
                status.should.equals(401);
                message.should.be.a('string').that.equals('Not logged in!');
                done();
            });
    });
    it('TC-206-3 Actor is not the owner', (done) => {
        chai.request(server)
            .delete('/api/user/2')
            // Not the owner of the data
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message')
                let { status, message } = res.body;
                status.should.equals(403);
                message.should.be.a('string').that.equals('Not the owner of this account!');
                done();
            });
    });
    it('TC-206-4 User has been deleted successfully', (done) => {
        chai.request(server)
            .delete('/api/user/2')
            .set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey)
            )
            .end((req, res) => {
                res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'message');
                let { status, message } = res.body;
                status.should.equals(200);
                message.should.be.a('string').that.equals('User has been deleted!');
                done();
            });
    });
});