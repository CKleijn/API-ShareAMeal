// process.env.DB_DATABASE = 'share-a-meal-testdb';
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

// const INSERT_MEALS = 'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' + '(1, "Meal A", "description", "image url", 5, 6.50, 1),' + '(2, "Meal B", "description", "image url", 5, 6.50, 1);';
// const INSERT_USER = 'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`) VALUES' + '(1, "first", "last", "test@server.nl", "secret", "street", "city");';
// const INSERT_SECOND_USER = 'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`) VALUES' + '(2, "first2", "last2", "test2@server.nl", "secret", "street2", "city2");';

// // Create the tests
// describe('Meal testsets', () => {
//     beforeEach((done) => {
//         dbconnection.getConnection((err, connection) => {
//             if (err) throw err;

//             connection.query(CLEAR_DB + INSERT_USER + INSERT_SECOND_USER + INSERT_MEALS, (err, results, fields) => {
//                 if (err) throw err;
//                 connection.release();
//                 done();
//             });
//         });
//     });
//     describe('UC-301 Create a meal', () => {
//         it('TC-301-1 Required input is missing', (done) => {
//             chai.request(server)
//                 .post('/api/meal')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .send({
//                     // name is missing
//                     description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
//                     isActive: 1,
//                     isVega: 0,
//                     isVegan: 0,
//                     isToTakeHome: 1,
//                     dateTime: '2022-03-22T16:35:00.000Z',
//                     imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
//                     maxAmountOfParticipants: 4,
//                     price: 12.75,
//                     allergenes: [
//                         'gluten', 
//                         'noten'
//                     ]
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('name must be a string!');
//                     done();
//                 });
//         });
//         it('TC-301-2 Not logged in', (done) => {
//             chai.request(server)
//                 .post('/api/meal')
//                 // User is not logged in
//                 .send({
//                     name: 'Pasta Bolognese met tomaat, spekjes en kaas',
//                     description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
//                     isActive: 1,
//                     isVega: 0,
//                     isVegan: 0,
//                     isToTakeHome: 1,
//                     dateTime: '2022-03-22T16:35:00.000Z',
//                     imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
//                     maxAmountOfParticipants: 4,
//                     price: 12.75,
//                     allergenes: [
//                         'gluten', 
//                         'noten'
//                     ]
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
//         it('TC-301-3 Meal succesfully added', (done) => {
//             chai.request(server)
//                 .post('/api/meal')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .send({
//                     name: 'Pasta Bolognese met tomaat, spekjes en kaas',
//                     description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
//                     isActive: 1,
//                     isVega: 0,
//                     isVegan: 0,
//                     isToTakeHome: 1,
//                     dateTime: '2022-03-22T16:35:00.000Z',
//                     imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
//                     maxAmountOfParticipants: 4,
//                     price: 12.75,
//                     allergenes: [
//                         'gluten', 
//                         'noten'
//                     ]
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message', 'result')
//                     let { status, message, result } = res.body;
//                     createdMealId = result.id;
//                     status.should.equals(201);
//                     message.should.be.a('string').that.equals('Meal has been created!');
//                     result.should.have.property('id');
//                     result.should.have.property('isActive');
//                     result.should.have.property('isVega');
//                     result.should.have.property('isVegan');
//                     result.should.have.property('isToTakeHome');
//                     result.should.have.property('dateTime');
//                     result.should.have.property('imageUrl');
//                     result.should.have.property('maxAmountOfParticipants');
//                     result.should.have.property('price');
//                     result.should.have.property('allergenes');
//                     done();
//                 });
//         });
//     });

//     describe('UC-302 Modify meal', () => {
//         it('TC-302-1 Required input is missing', (done) => {
//             chai.request(server)
//                 .put('/api/meal/1')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .send({
//                     // name is missing
//                     description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
//                     isActive: 1,
//                     isVega: 0,
//                     isVegan: 0,
//                     isToTakeHome: 1,
//                     dateTime: '2022-03-22T16:35:00.000Z',
//                     imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
//                     maxAmountOfParticipants: 5,
//                     price: 12.75,
//                     allergenes: [
//                         'gluten', 
//                         'noten'
//                     ]
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(400);
//                     message.should.be.a('string').that.equals('name must be a string!');
//                     done();
//                 });
//         });
//         it('TC-302-2 Not logged in', (done) => {
//             chai.request(server)
//                 .put('/api/meal/1')
//                 // User is not logged in
//                 .send({
//                     name: 'Macaroni Bolognese met tomaat, spekjes en kaas',
//                     description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
//                     isActive: 1,
//                     isVega: 0,
//                     isVegan: 0,
//                     isToTakeHome: 1,
//                     dateTime: '2022-03-22T16:35:00.000Z',
//                     imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
//                     maxAmountOfParticipants: 5,
//                     price: 12.75,
//                     allergenes: [
//                         'gluten', 
//                         'noten'
//                     ]
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
//         it('TC-302-3 Not owner of the data', (done) => {
//             chai.request(server)
//                 .put('/api/meal/1')
//                 // Not owner of the data
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey)
//                 )
//                 .send({
//                     name: 'Macaroni Bolognese met tomaat, spekjes en kaas',
//                     description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
//                     isActive: 1,
//                     isVega: 0,
//                     isVegan: 0,
//                     isToTakeHome: 1,
//                     dateTime: '2022-03-22T16:35:00.000Z',
//                     imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
//                     maxAmountOfParticipants: 5,
//                     price: 12.75,
//                     allergenes: [
//                         'gluten', 
//                         'noten'
//                     ]
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(403);
//                     message.should.be.a('string').that.equals('Not the owner of the data!');
//                     done();
//                 });
//         });
//         it('TC-302-4 Meal doesnt exist', (done) => {
//             chai.request(server)
//                 // Meal doesnt exist
//                 .put('/api/meal/0')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .send({
//                     name: 'Macaroni Bolognese met tomaat, spekjes en kaas',
//                     description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
//                     isActive: 1,
//                     isVega: 0,
//                     isVegan: 0,
//                     isToTakeHome: 1,
//                     dateTime: '2022-03-22T16:35:00.000Z',
//                     imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
//                     maxAmountOfParticipants: 5,
//                     price: 12.75,
//                     allergenes: [
//                         'gluten', 
//                         'noten'
//                     ]
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(404);
//                     message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
//                     done();
//                 });
//         });
//         it('TC-302-5 Meal succesfully modified', (done) => {
//             chai.request(server)
//                 .put('/api/meal/1')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .send({
//                     name: 'Macaroni Bolognese met tomaat, spekjes en kaas',
//                     description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
//                     isActive: 1,
//                     isVega: 0,
//                     isVegan: 0,
//                     isToTakeHome: 1,
//                     dateTime: '2022-03-22T16:35:00.000Z',
//                     imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
//                     maxAmountOfParticipants: 5,
//                     price: 12.75,
//                     allergenes: [
//                         'gluten', 
//                         'noten'
//                     ]
//                 })
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message', 'result')
//                     let { status, message, result } = res.body;
//                     status.should.equals(200);
//                     message.should.be.a('string').that.equals('Meal has been updated!');
//                     result.should.have.property('id');
//                     result.should.have.property('isActive');
//                     result.should.have.property('isVega');
//                     result.should.have.property('isVegan');
//                     result.should.have.property('isToTakeHome');
//                     result.should.have.property('dateTime');
//                     result.should.have.property('imageUrl');
//                     result.should.have.property('maxAmountOfParticipants');
//                     result.should.have.property('price');
//                     result.should.have.property('allergenes');
//                     done();
//                 });
//         });
//     });

//     describe('UC-303 Get list of all meals', () => {
//         it('TC-303-1 List of all meals returned', (done) => {
//             chai.request(server)
//                 .get('/api/meal')
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'result')
//                     let { status, result } = res.body;
//                     status.should.equals(200);
//                     result.forEach(meal => {
//                         meal.should.have.property('id');
//                         meal.should.have.property('isActive');
//                         meal.should.have.property('isVega');
//                         meal.should.have.property('isVegan');
//                         meal.should.have.property('isToTakeHome');
//                         meal.should.have.property('dateTime');
//                         meal.should.have.property('imageUrl');
//                         meal.should.have.property('maxAmountOfParticipants');
//                         meal.should.have.property('price');
//                         meal.should.have.property('allergenes');
//                     });
//                     done();
//                 });
//         });
//     });

//     describe('UC-304 Get details of a specific meal', () => {
//         it('TC-304-1 Meal doesnt exist', (done) => {
//             chai.request(server)
//                 // Meal doesnt exist
//                 .get('/api/meal/0')
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(404);
//                     message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
//                     done();
//                 });
//         });
//         it('TC-304-2 Details of a specific meal returned', (done) => {
//             chai.request(server)
//                 .get('/api/meal/1')
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'result')
//                     let { status, result } = res.body;
//                     status.should.equals(200);
//                     result.should.have.property('id');
//                     result.should.have.property('isActive');
//                     result.should.have.property('isVega');
//                     result.should.have.property('isVegan');
//                     result.should.have.property('isToTakeHome');
//                     result.should.have.property('dateTime');
//                     result.should.have.property('imageUrl');
//                     result.should.have.property('maxAmountOfParticipants');
//                     result.should.have.property('price');
//                     result.should.have.property('allergenes');
//                     done();
//                 });
//         });
//     });

//     describe('UC-305 Delete meal', () => {
//         it('TC-305-2 Not logged in', (done) => {
//             chai.request(server)
//                 .delete('/api/meal/1')
//                 // User not logged in
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
//         it('TC-304-3 Not owner of the data', (done) => {
//             chai.request(server)
//                 .delete('/api/meal/1')
//                 // Not the owner of the data
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey)
//                 )
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(403);
//                     message.should.be.a('string').that.equals('Not the owner of the data!');
//                     done();
//                 });
//         });
//         it('TC-304-4 Meal doesnt exist', (done) => {
//             chai.request(server)
//                 // Meal doesnt exist
//                 .delete('/api/meal/0')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(404);
//                     message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
//                     done();
//                 });
//         });
//         it('TC-304-5 Meal has been deleted successfully', (done) => {
//             chai.request(server)
//                 .delete('/api/meal/1')
//                 .set(
//                     'authorization',
//                     'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
//                 )
//                 .end((req, res) => {
//                     res.body.should.be
//                             .an('object')
//                             .that.has.all.keys('status', 'message')
//                     let { status, message } = res.body;
//                     status.should.equals(200);
//                     message.should.be.a('string').that.equals('Meal has been removed!');
//                     done();
//                 });
//         });
//     });
// });