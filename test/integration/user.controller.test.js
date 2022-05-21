// process.env.DB_DATABASE = process.env.DB_DATABASE ||'share-a-meal-testdb';
// // Default settings
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../../index');
// const dbconnection = require('./../../database/dbconnection');
// const jwt = require('jsonwebtoken');
// const { jwtSecretKey } = require('../../src/config/config');

// // Use should for assert
// chai.should();
// chai.use(chaiHttp);

// const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;';
// const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;';
// const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;';
// const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE;

// const INSERT_MEALS = 'INSERT INTO `meal` (`id`, `name`, `description`, `dateTime`, `imageUrl`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' + '(1, "Meal A", "description", "2022-03-22T15:35:00.000Z", "image url", 5, 6.50, 1),' + '(2, "Meal B", "description", "2022-03-22T15:35:00.000Z", "image url", 5, 6.50, 1);';
// const INSERT_USER = 'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`) VALUES' + '(1, "first", "last", "test@server.nl", "$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW", "street", "city");';
// const INSERT_SECOND_USER = 'INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `street`, `city`) VALUES' + '(2, "first2", "last2", "false", "test2@server.nl", "$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW", "street2", "city2");';
// const INSERT_PARTICIPANT = 'INSERT INTO meal_participants_user (mealId, userId) VALUES (1, 1),' + '(2, 2),' + '(1, 2)';

// // Create the tests
// describe('User testsets', () => {
//     beforeEach((done) => {
//         dbconnection.getConnection((err, connection) => {
//             if (err) throw err;

//             connection.query(CLEAR_DB + INSERT_USER + INSERT_SECOND_USER + INSERT_MEALS + INSERT_PARTICIPANT, (err, results, fields) => {
//                 if (err) throw err;
//                 connection.release();
//                 done();
//             });
//         });
//     });
//     describe('UC-201 Register as new user', () => {
//         it('TC-201-1 Required input is missing', (done) => {
//             chai.request(server)
//                 .post('/api/user')
//                 .send({
//                     // firstName is missing
//                     lastName: 'last',
//                     street: 'street',
//                     city: 'city',
//                     emailAdress: 'test3@server.nl',
//                     password: 'Secret123',
//                     phoneNumber: '06 12345678'
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message');
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('firstName must be a string!');
//                     done();
//                 });
//         });
//         it('TC-201-2 Email address is not valid', (done) => {
//             chai.request(server)
//                 .post('/api/user')
//                 .send({
//                     firstName: 'first',
//                     lastName: 'last',
//                     street: 'street',
//                     city: 'city',
//                     // emailAdress is not valid
//                     emailAdress: 'test3servernl',
//                     password: 'Secret123',
//                     phoneNumber: '06 12345678'
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message');
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('emailAdress is not valid!');
//                     done();
//                 });
//         });
//         it('TC-201-3 Password is not valid', (done) => {
//             chai.request(server)
//                 .post('/api/user')
//                 .send({
//                     firstName: 'first',
//                     lastName: 'last',
//                     street: 'street',
//                     city: 'city',
//                     emailAdress: 'test3@server.nl',
//                     // password is not valid
//                     password: 'secret',
//                     phoneNumber: '06 12345678'
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message');
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('password is not valid!');
//                     done();
//                 });
//         });
//         it('TC-201-4 User already exist', (done) => {
//             chai.request(server)
//                 .post('/api/user')
//                 .send({
//                     // User is valid
//                     firstName: 'first',
//                     lastName: 'last',
//                     street: 'street',
//                     city: 'city',
//                     emailAdress: 'test@server.nl',
//                     password: 'Secret123',
//                     phoneNumber: '06 12345678'
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message');
//                     let { status, message } = res.body;
//                     status.should.equals(409);
//                     message.should.be.a('string').that.equals('User already exist!');
//                     done();
//                 });
//         });
//         it('TC-201-5 User has registered successfully', (done) => {
//             chai.request(server)
//                 .post('/api/user')
//                 .send({
//                     // User is valid
//                     firstName: 'first',
//                     lastName: 'last',
//                     street: 'street',
//                     city: 'city',
//                     emailAdress: 'test3@server.nl',
//                     password: 'Secret123',
//                     phoneNumber: '06 12345678'
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message', 'result');
//                     let { status, message, result } = res.body;
//                     status.should.equals(201);
//                     message.should.be.a('string').that.equals('User has been created!');
//                     // Result should have those keys
//                     result.should.have.property('id');
//                     result.should.have.property('firstName');
//                     result.should.have.property('lastName');
//                     result.should.have.property('isActive');
//                     result.should.have.property('street');
//                     result.should.have.property('city');
//                     result.should.have.property('emailAdress');
//                     result.should.have.property('password');
//                     result.should.have.property('phoneNumber');
//                     result.should.have.property('roles');
//                     // Those keys should have those values
//                     result.id.should.equal(result.id);
//                     result.firstName.should.equal('first');
//                     result.lastName.should.equal('last');
//                     result.isActive.should.equal(true);
//                     result.street.should.equal('street');
//                     result.city.should.equal('city');
//                     result.emailAdress.should.equal('test3@server.nl');
//                     result.password.should.equal(result.password);
//                     result.phoneNumber.should.equal('06 12345678');
//                     result.roles.should.equal('editor,guest');
//                     done();
//                 });
//         });
//     });

//     describe('UC-202 Overview of users', () => {
//         it('TC-202-1 Show zero users', (done) => {
//             chai.request(server)
//                 .get('/api/user')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .query({limit: 0})
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'result');
//                     let { status, result } = res.body;
//                     status.should.equals(200);
//                     result.should.have.length(0);
//                     done();
//                 });
//         });
//         it('TC-202-2 Show two users', (done) => {
//             chai.request(server)
//                 .get('/api/user')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .query({limit: 2})
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'result');
//                     let { status, result } = res.body;
//                     status.should.equals(200);
//                     result.should.have.length(2);
//                     // Result should have those keys
//                     // User 1
//                     result[0].should.have.property('id');
//                     result[0].should.have.property('firstName');
//                     result[0].should.have.property('lastName');
//                     result[0].should.have.property('isActive');
//                     result[0].should.have.property('street');
//                     result[0].should.have.property('city');
//                     result[0].should.have.property('emailAdress');
//                     result[0].should.have.property('password');
//                     result[0].should.have.property('phoneNumber');
//                     result[0].should.have.property('roles');
//                     // User 2
//                     result[1].should.have.property('id');
//                     result[1].should.have.property('firstName');
//                     result[1].should.have.property('lastName');
//                     result[1].should.have.property('isActive');
//                     result[1].should.have.property('street');
//                     result[1].should.have.property('city');
//                     result[1].should.have.property('emailAdress');
//                     result[1].should.have.property('password');
//                     result[1].should.have.property('phoneNumber');
//                     result[1].should.have.property('roles');
//                     // Those keys should have those values
//                     // User 1
//                     result[0].id.should.equal(1);
//                     result[0].firstName.should.equal('first');
//                     result[0].lastName.should.equal('last');
//                     result[0].isActive.should.equal(true);
//                     result[0].street.should.equal('street');
//                     result[0].city.should.equal('city');
//                     result[0].emailAdress.should.equal('test@server.nl');
//                     result[0].password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
//                     result[0].phoneNumber.should.equal('-');
//                     result[0].roles.should.equal('editor,guest');
//                     // User 2
//                     result[1].id.should.equal(2);
//                     result[1].firstName.should.equal('first2');
//                     result[1].lastName.should.equal('last2');
//                     result[1].isActive.should.equal(false);
//                     result[1].street.should.equal('street2');
//                     result[1].city.should.equal('city2');
//                     result[1].emailAdress.should.equal('test2@server.nl');
//                     result[1].password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
//                     result[1].phoneNumber.should.equal('-');
//                     result[1].roles.should.equal('editor,guest');
//                     done();
//                 });
//         });
//         it('TC-202-3 Show users with search term by non-existent name', (done) => {
//             chai.request(server)
//                 .get('/api/user')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .query({firstName: 'Jonas'})
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'result');
//                     let { status, result } = res.body;
//                     status.should.equals(200);
//                     result.should.have.length(0);
//                     done();
//                 });
//         });
//         it('TC-202-4 Show users using the search term in the field isActive = false', (done) => {
//             chai.request(server)
//                 .get('/api/user')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .query({isActive: 'false'})
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'result');
//                     let { status, result } = res.body;
//                     status.should.equals(200);
//                     // Result should have those keys
//                     result.should.have.property('id');
//                     result.should.have.property('firstName');
//                     result.should.have.property('lastName');
//                     result.should.have.property('isActive');
//                     result.should.have.property('street');
//                     result.should.have.property('city');
//                     result.should.have.property('emailAdress');
//                     result.should.have.property('password');
//                     result.should.have.property('phoneNumber');
//                     result.should.have.property('roles'); 
//                     // Those keys should have those values
//                     result.id.should.equal(2);
//                     result.firstName.should.equal('first2');
//                     result.lastName.should.equal('last2');
//                     result.isActive.should.equal(false);
//                     result.street.should.equal('street2');
//                     result.city.should.equal('city2');
//                     result.emailAdress.should.equal('test2@server.nl');
//                     result.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
//                     result.phoneNumber.should.equal('-');
//                     result.roles.should.equal('editor,guest');
//                     done();
//                 });
//         });
//         it('TC-202-5 Show users using the search term in the field isActive = true', (done) => {
//             chai.request(server)
//                 .get('/api/user')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .query({isActive: 'true'})
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'result');
//                     let { status, result } = res.body;
//                     status.should.equals(200);
//                     // Result should have those keys
//                     result.should.have.property('id');
//                     result.should.have.property('firstName');
//                     result.should.have.property('lastName');
//                     result.should.have.property('isActive');
//                     result.should.have.property('street');
//                     result.should.have.property('city');
//                     result.should.have.property('emailAdress');
//                     result.should.have.property('password');
//                     result.should.have.property('phoneNumber');
//                     result.should.have.property('roles'); 
//                     // Those keys should have those values
//                     result.id.should.equal(1);
//                     result.firstName.should.equal('first');
//                     result.lastName.should.equal('last');
//                     result.isActive.should.equal(true);
//                     result.street.should.equal('street');
//                     result.city.should.equal('city');
//                     result.emailAdress.should.equal('test@server.nl');
//                     result.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
//                     result.phoneNumber.should.equal('-');
//                     result.roles.should.equal('editor,guest');
//                     done();
//                 });
//         });
//         it('TC-202-6 Show users with search term by existing name', (done) => {
//             chai.request(server)
//                 .get('/api/user')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .query({firstName: 'first'})
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'result');
//                     let { status, result } = res.body;
//                     status.should.equals(200);
//                     // Result should have those keys
//                     result.should.have.property('id');
//                     result.should.have.property('firstName');
//                     result.should.have.property('lastName');
//                     result.should.have.property('isActive');
//                     result.should.have.property('street');
//                     result.should.have.property('city');
//                     result.should.have.property('emailAdress');
//                     result.should.have.property('password');
//                     result.should.have.property('phoneNumber');
//                     result.should.have.property('roles'); 
//                     // Those keys should have those values
//                     result.id.should.equal(1);
//                     result.firstName.should.equal('first');
//                     result.lastName.should.equal('last');
//                     result.isActive.should.equal(true);
//                     result.street.should.equal('street');
//                     result.city.should.equal('city');
//                     result.emailAdress.should.equal('test@server.nl');
//                     result.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
//                     result.phoneNumber.should.equal('-');
//                     result.roles.should.equal('editor,guest');
//                     done();
//                 });
//         });
//     });

//     describe('UC-203 User profile request', () => {
//         it('TC-203-1 Invalid token', (done) => {
//             chai.request(server)
//                 .get('/api/user/profile')
//                 // Invalid token
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, 'invalidToken')
//                 )
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message');
//                     let { status, message } = res.body;
//                     status.should.equals(401);
//                     message.should.be.a('string').that.equals('Invalid token!');
//                     done();
//                 });
//         });
//         it('TC-203-2 Valid token and user exists', (done) => {
//             chai.request(server)
//                 .get('/api/user/profile')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'result');
//                     let { status, result } = res.body;
//                     status.should.equals(200);
//                     // Result should have those keys
//                     result.should.have.property('id');
//                     result.should.have.property('firstName');
//                     result.should.have.property('lastName');
//                     result.should.have.property('isActive');
//                     result.should.have.property('street');
//                     result.should.have.property('city');
//                     result.should.have.property('emailAdress');
//                     result.should.have.property('password');
//                     result.should.have.property('phoneNumber');
//                     result.should.have.property('roles'); 
//                     // Those keys should have those values
//                     result.id.should.equal(1);
//                     result.firstName.should.equal('first');
//                     result.lastName.should.equal('last');
//                     result.isActive.should.equal(true);
//                     result.street.should.equal('street');
//                     result.city.should.equal('city');
//                     result.emailAdress.should.equal('test@server.nl');
//                     result.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
//                     result.phoneNumber.should.equal('-');
//                     result.roles.should.equal('editor,guest');
//                     done();
//                 });
//         });
//     });

//     describe('UC-204 Details of user', () => {
//         it('TC-204-1 Invalid token', (done) => {
//             chai.request(server)
//                 .put('/api/user/1')
//                 // Invalid token
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, 'invalidToken')
//                 )
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message');
//                     let { status, message } = res.body;
//                     status.should.equals(401);
//                     message.should.be.a('string').that.equals('Invalid token!');
//                     done();
//                 });
//         });
//         it('TC-204-2 User-ID doesnt exist', (done) => {
//             chai.request(server)
//                 // User-ID doesnt exist
//                 .get('/api/user/0')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message');
//                     let { status, message } = res.body;
//                     status.should.equals(404);
//                     message.should.be.a('string').that.equals('User does not exist');
//                     done();
//                 });
//         });
//         it('TC-204-3 User-ID exist', (done) => {
//             chai.request(server)
//                 .get('/api/user/1')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'result');
//                     let { status, result } = res.body;
//                     status.should.equals(200);
//                     // Result should have those keys
//                     result.should.have.property('id');
//                     result.should.have.property('firstName');
//                     result.should.have.property('lastName');
//                     result.should.have.property('isActive');
//                     result.should.have.property('street');
//                     result.should.have.property('city');
//                     result.should.have.property('emailAdress');
//                     result.should.have.property('password');
//                     result.should.have.property('phoneNumber');
//                     result.should.have.property('roles'); 
//                     // Those keys should have those values
//                     result.id.should.equal(1);
//                     result.firstName.should.equal('first');
//                     result.lastName.should.equal('last');
//                     result.isActive.should.equal(true);
//                     result.street.should.equal('street');
//                     result.city.should.equal('city');
//                     result.emailAdress.should.equal('test@server.nl');
//                     result.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
//                     result.phoneNumber.should.equal('-');
//                     result.roles.should.equal('editor,guest');
//                     done();
//                 });
//         });
//     });

//     describe('UC-205 Modify user', () => {
//         it('TC-205-1 Required input is missing', (done) => {
//             chai.request(server)
//                 .put('/api/user/1')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .send({
//                     // emailAdress is missing
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message');
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('emailAdress must be a string!');
//                     done();
//                 });
//         });
//         it('TC-205-3 Phone number is not valid', (done) => {
//             chai.request(server)
//                 .put('/api/user/1')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .send({
//                     emailAdress: 'test@server.nl',
//                     // phoneNumber is not valid
//                     phoneNumber: '06 1234'  
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message');
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('phoneNumber is not valid!');
//                     done();
//                 });
//         });
//         it('TC-205-4 User doesnt exist', (done) => {
//             chai.request(server)
//                 // User doesnt exist
//                 .put('/api/user/0')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .send({
//                     emailAdress: 'test4@server.nl'
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message');
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('User does not exist');
//                     done();
//                 });
//         });
//         it('TC-205-5 Not logged in', (done) => {
//             chai.request(server)
//                 .put('/api/user/1')
//                 // User is not logged in
//                 .send({
//                     emailAdress: 'test@server.nl'
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(401);
//                     message.should.be.a('string').that.equals('Not logged in!');
//                     done();
//                 });
//         });
//         it('TC-205-6 User has modified successfully', (done) => {
//             chai.request(server)
//                 .put('/api/user/1')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .send({
//                     // User is valid
//                     emailAdress: 'test@server.nl',
//                     phoneNumber: '06 87654321'  
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message', 'result');
//                     let { status, message, result } = res.body;
//                     status.should.equals(200);
//                     message.should.be.a('string').that.equals('User has been updated!');
//                     // Result should have those keys
//                     result.should.have.property('id');
//                     result.should.have.property('firstName');
//                     result.should.have.property('lastName');
//                     result.should.have.property('isActive');
//                     result.should.have.property('street');
//                     result.should.have.property('city');
//                     result.should.have.property('emailAdress');
//                     result.should.have.property('password');
//                     result.should.have.property('phoneNumber');
//                     result.should.have.property('roles'); 
//                     // Those keys should have those values
//                     result.id.should.equal(1);
//                     result.firstName.should.equal('first');
//                     result.lastName.should.equal('last');
//                     result.isActive.should.equal(true);
//                     result.street.should.equal('street');
//                     result.city.should.equal('city');
//                     result.emailAdress.should.equal('test@server.nl');
//                     result.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
//                     result.phoneNumber.should.equal('06 87654321');
//                     result.roles.should.equal('editor,guest');
//                     done();
//                 });
//         });
//     });

//     // describe('UC-206 Delete user', () => {
//     //     it('TC-206-1 User doesnt exist', (done) => {
//     //         chai.request(server)
//     //             // User doesnt exist
//     //             .delete('/api/user/0')
//     //             .set(
//     //                 'authorization',
//     //                 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//     //             )
//     //             .end((req, res) => {
//     //                 res.body.should.be
//     //                         .an('object')
//     //                         .that.has.all.keys('status', 'message');
//     //                 let { status, message } = res.body;
//     //                 status.should.equals(400);
//     //                 message.should.be.a('string').that.equals('User does not exist');
//     //                 done();
//     //             });
//     //     });
//     //     it('TC-206-2 Not logged in', (done) => {
//     //         chai.request(server)
//     //             .delete('/api/user/1')
//     //             // Not logged in
//     //             .end((req, res) => {
//     //                 res.body.should.be
//     //                         .an('object')
//     //                         .that.has.all.keys('status', 'message')
//     //                 let { status, message } = res.body;
//     //                 status.should.equals(401);
//     //                 message.should.be.a('string').that.equals('Not logged in!');
//     //                 done();
//     //             });
//     //     });
//     //     it('TC-206-3 Actor is not the owner', (done) => {
//     //         chai.request(server)
//     //             .delete('/api/user/2')
//     //             // Not the owner of the data
//     //             .set(
//     //                 'authorization',
//     //                 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//     //             )
//     //             .end((req, res) => {
//     //                 res.body.should.be
//     //                         .an('object')
//     //                         .that.has.all.keys('status', 'message')
//     //                 let { status, message } = res.body;
//     //                 status.should.equals(403);
//     //                 message.should.be.a('string').that.equals('Not the owner of this account!');
//     //                 done();
//     //             });
//     //     });
//     //     it('TC-206-4 User has been deleted successfully', (done) => {
//     //         chai.request(server)
//     //             .delete('/api/user/2')
//     //             .set(
//     //                 'authorization',
//     //                 'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey)
//     //             )
//     //             .end((req, res) => {
//     //                 res.body.should.be
//     //                         .an('object')
//     //                         .that.has.all.keys('status', 'message');
//     //                 let { status, message } = res.body;
//     //                 status.should.equals(200);
//     //                 message.should.be.a('string').that.equals('User has been deleted!');
//     //                 done();
//     //             });
//     //     });
//     // });
// });
