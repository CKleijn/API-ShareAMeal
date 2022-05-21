// process.env.DB_DATABASE = process.env.DB_DATABASE ||'share-a-meal-testdb';
// // Default settings
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../../index');
// const dbconnection = require('./../../database/dbconnection');

// // Use should for assert
// chai.should();
// chai.use(chaiHttp);

// const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;';
// const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;';
// const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;';
// const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE;

// const INSERT_MEALS = 'INSERT INTO `meal` (`id`, `name`, `description`, `dateTime`, `imageUrl`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' + '(1, "Meal A", "description", "2022-03-22T15:35:00.000Z", "image url", 5, 6.50, 1),' + '(2, "Meal B", "description", "2022-03-22T15:35:00.000Z", "image url", 5, 6.50, 1);';
// const INSERT_USER = 'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`) VALUES' + '(1, "first", "last", "test@server.nl", "$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW", "street", "city");';
// const INSERT_SECOND_USER = 'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`) VALUES' + '(2, "first2", "last2", "test2@server.nl", "$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW", "street2", "city2");';
// const INSERT_PARTICIPANT = 'INSERT INTO meal_participants_user (mealId, userId) VALUES (1, 1),' + '(2, 2),' + '(1, 2)';

// // Create the tests
// describe('Authentication testsets', () => {
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
//     describe('UC-101 Login', () => {
//         it('TC-101-1 Required input is missing', (done) => {
//             chai.request(server)
//                 .post('/api/auth/login')
//                 .send({
//                     emailAdress: 'test@server.nl'
//                     // password doesnt exist
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('password must be a string!');
//                     done();
//                 });
//         });
//         it('TC-101-2 Not valid emailAdress', (done) => {
//             chai.request(server)
//                 .post('/api/auth/login')
//                 .send({
//                     // emailAdress not valid
//                     emailAdress: 'test',
//                     password: 'Secret123'
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('emailAdress is not valid!');
//                     done();
//                 });
//         });
//         it('TC-101-3 Not valid password', (done) => {
//             chai.request(server)
//                 .post('/api/auth/login')
//                 .send({
//                     emailAdress: 'test@server.nl',
//                     // password not valid
//                     password: 'secret'
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('password is not valid!');
//                     done();
//                 });
//         });
//         it('TC-101-4 User doesnt exist', (done) => {
//             chai.request(server)
//                 .post('/api/auth/login')
//                 .send({
//                     // User doesnt exist
//                     emailAdress: 'test99@server.nl',
//                     password: 'Secret123'
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(404);
//                     message.should.be.a('string').that.equals('User not found or password invalid');
//                     done();
//                 });
//         });
//         it('TC-101-5 User succesfully logged in', (done) => {
//             chai.request(server)
//             .post('/api/auth/login')
//             .send({
//                 // Valid user
//                 emailAdress: 'test@server.nl',
//                 password: 'Secret123'
//             })
//             .end((req, res) => {
//                 res.body.should.be
//                         .an('object')
//                         .that.has.all.keys('status', 'result')
//                 let { status, result } = res.body;
//                 status.should.equals(200);
//                 // Result should have those keys
//                 result.should.have.property('id');
//                 result.should.have.property('firstName');
//                 result.should.have.property('lastName');
//                 result.should.have.property('emailAdress');
//                 result.should.have.property('token');
//                 // Those keys should have those values
//                 result.id.should.equal(1);
//                 result.firstName.should.equal('first');
//                 result.lastName.should.equal('last');
//                 result.emailAdress.should.equal('test@server.nl');
//                 done();
//             });
//         });
//     });
// });