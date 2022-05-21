process.env.DB_DATABASE = process.env.DB_DATABASE ||'share-a-meal-testdb';
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

const INSERT_MEALS = 'INSERT INTO `meal` (`id`, `name`, `description`, `dateTime`, `imageUrl`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' + "(1, 'Meal A', 'description', NOW(), 'image url', 5, 6.50, 1)," + "(2, 'Meal B', 'description', NOW(), 'image url', 5, 6.50, 2);"
const INSERT_USER = 'INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `street`, `city`) VALUES' + '(1, "first", "last", "1", "test@server.nl", "$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW", "street", "city");';
const INSERT_SECOND_USER = 'INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `street`, `city`) VALUES' + '(2, "first2", "last2", "0", "test2@server.nl", "$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW", "street2", "city2");';
const INSERT_PARTICIPANT = 'INSERT INTO meal_participants_user (mealId, userId) VALUES (1, 1),' + '(2, 2),' + '(1, 2)';

// Create the tests
describe('Meal testsets', () => {
    beforeEach((done) => {
        dbconnection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(CLEAR_DB + INSERT_USER + INSERT_SECOND_USER + INSERT_MEALS + INSERT_PARTICIPANT, (err, results, fields) => {
                if (err) throw err;
                connection.release();
                done();
            });
        });
    });
    describe('UC-301 Create a meal', () => {
        it('TC-301-1 Required input is missing', (done) => {
            chai.request(server)
                .post('/api/meal')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .send({
                    // name is missing
                    description: 'description',
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    dateTime: NOW(),
                    imageUrl: 'image url',
                    maxAmountOfParticipants: 5,
                    price: 6.50,
                    allergenes: [
                        'gluten'
                    ]
                })
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message')
                    let { status, message } = res.body;
                    status.should.equals(400);
                    message.should.be.a('string').that.equals('name must be a string!');
                    done();
                });
        });
        it('TC-301-2 Not logged in', (done) => {
            chai.request(server)
                .post('/api/meal')
                // User is not logged in
                .send({
                    name: 'Meal C',
                    description: 'description',
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    dateTime: NOW(),
                    imageUrl: 'image url',
                    maxAmountOfParticipants: 5,
                    price: 6.50,
                    allergenes: [
                        'gluten'
                    ]
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
        it('TC-301-3 Meal succesfully added', (done) => {
            chai.request(server)
                .post('/api/meal')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey)
                )
                .send({
                    name: 'Meal C',
                    description: 'description',
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    dateTime: NOW(),
                    imageUrl: 'image url',
                    maxAmountOfParticipants: 5,
                    price: 6.50,
                    allergenes: [
                        'gluten'
                    ]
                })
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message', 'result')
                    let { status, message, result } = res.body;
                    status.should.equals(201);
                    message.should.be.a('string').that.equals('Meal has been created!');
                    // Result should have those keys
                    result.should.have.property('id');
                    result.should.have.property('name'),
                    result.should.have.property('description')
                    result.should.have.property('isActive');
                    result.should.have.property('isVega');
                    result.should.have.property('isVegan');
                    result.should.have.property('isToTakeHome');
                    result.should.have.property('dateTime');
                    result.should.have.property('createDate');
                    result.should.have.property('updateDate');
                    result.should.have.property('imageUrl');
                    result.should.have.property('maxAmountOfParticipants');
                    result.should.have.property('price');
                    result.should.have.property('allergenes');
                    result.cook.should.have.property('id');
                    result.cook.should.have.property('firstName');
                    result.cook.should.have.property('lastName');
                    result.cook.should.have.property('isActive');
                    result.cook.should.have.property('street');
                    result.cook.should.have.property('city');
                    result.cook.should.have.property('emailAdress');
                    result.cook.should.have.property('password');
                    result.cook.should.have.property('phoneNumber');
                    result.cook.should.have.property('roles');
                    result.participants[0].should.have.property('id');
                    result.participants[0].should.have.property('firstName');
                    result.participants[0].should.have.property('lastName');
                    result.participants[0].should.have.property('isActive');
                    result.participants[0].should.have.property('street');
                    result.participants[0].should.have.property('city');
                    result.participants[0].should.have.property('emailAdress');
                    result.participants[0].should.have.property('password');
                    result.participants[0].should.have.property('phoneNumber');
                    result.participants[0].should.have.property('roles');
                    // Those keys should have those values
                    result.id.should.equal(result.id);
                    result.name.should.equal('Meal C');
                    result.description.should.equal('description');
                    result.isActive.should.equal(true);
                    result.isVega.should.equal(false);
                    result.isVegan.should.equal(false);
                    result.isToTakeHome.should.equal(true);
                    result.dateTime.should.equal(result.dateTime);
                    result.createDate.should.equal(result.createDate);
                    result.updateDate.should.equal(result.updateDate);
                    result.imageUrl.should.equal('image url');
                    result.maxAmountOfParticipants.should.equal(5);
                    result.price.should.equal(6.5);
                    result.allergenes[0].should.equal('gluten');
                    result.cook.id.should.equal(2);
                    result.cook.firstName.should.equal('first2');
                    result.cook.lastName.should.equal('last2');
                    result.cook.isActive.should.equal(false);
                    result.cook.street.should.equal('street2');
                    result.cook.city.should.equal('city2');
                    result.cook.emailAdress.should.equal('test2@server.nl');
                    result.cook.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result.cook.phoneNumber.should.equal('-');
                    result.cook.roles.should.equal('editor,guest');
                    result.participants[0].id.should.equal(2);
                    result.participants[0].firstName.should.equal('first2');
                    result.participants[0].lastName.should.equal('last2');
                    result.participants[0].isActive.should.equal(false);
                    result.participants[0].street.should.equal('street2');
                    result.participants[0].city.should.equal('city2');
                    result.participants[0].emailAdress.should.equal('test2@server.nl');
                    result.participants[0].password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result.participants[0].phoneNumber.should.equal('-');
                    result.participants[0].roles.should.equal('editor,guest');
                    done();
                });
        });
    });

    describe('UC-302 Modify meal', () => {
        it('TC-302-1 Required input is missing', (done) => {
            chai.request(server)
                .put('/api/meal/1')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .send({
                    // name is missing
                })
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message')
                    let { status, message } = res.body;
                    status.should.equals(400);
                    message.should.be.a('string').that.equals('name, maxAmountOfParticipants or price is required!');
                    done();
                });
        });
        it('TC-302-2 Not logged in', (done) => {
            chai.request(server)
                .put('/api/meal/1')
                // User is not logged in
                .send({
                    name: 'Meal C',
                    description: 'description',
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    dateTime: NOW(),
                    imageUrl: 'image url',
                    maxAmountOfParticipants: 5,
                    price: 6.50,
                    allergenes: [
                        'gluten'
                    ]
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
        it('TC-302-3 Not owner of the data', (done) => {
            chai.request(server)
                .put('/api/meal/1')
                // Not owner of the data
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey)
                )
                .send({
                    name: 'Meal C',
                    description: 'description',
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    dateTime: NOW(),
                    imageUrl: 'image url',
                    maxAmountOfParticipants: 5,
                    price: 6.50,
                    allergenes: [
                        'gluten'
                    ]
                })
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message')
                    let { status, message } = res.body;
                    status.should.equals(403);
                    message.should.be.a('string').that.equals('Not the owner of the data!');
                    done();
                });
        });
        it('TC-302-4 Meal doesnt exist', (done) => {
            chai.request(server)
                // Meal doesnt exist
                .put('/api/meal/0')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .send({
                    name: 'Meal C',
                    description: 'description',
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    dateTime: NOW(),
                    imageUrl: 'image url',
                    maxAmountOfParticipants: 5,
                    price: 6.50,
                    allergenes: [
                        'gluten'
                    ]
                })
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message')
                    let { status, message } = res.body;
                    status.should.equals(404);
                    message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
                    done();
                });
        });
        it('TC-302-5 Meal succesfully modified', (done) => {
            chai.request(server)
                .put('/api/meal/1')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .send({
                    name: 'Meal A XXL',
                    description: 'description',
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    dateTime: NOW(),
                    imageUrl: 'image url',
                    maxAmountOfParticipants: 5,
                    price: 6.50,
                    allergenes: [
                        'gluten'
                    ]
                })
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message', 'result')
                    let { status, message, result } = res.body;
                    status.should.equals(200);
                    message.should.be.a('string').that.equals('Meal has been updated!');
                    // Result should have those keys
                    result.should.have.property('id');
                    result.should.have.property('name'),
                    result.should.have.property('description')
                    result.should.have.property('isActive');
                    result.should.have.property('isVega');
                    result.should.have.property('isVegan');
                    result.should.have.property('isToTakeHome');
                    result.should.have.property('dateTime');
                    result.should.have.property('createDate');
                    result.should.have.property('updateDate');
                    result.should.have.property('imageUrl');
                    result.should.have.property('maxAmountOfParticipants');
                    result.should.have.property('price');
                    result.should.have.property('allergenes');
                    result.cook.should.have.property('id');
                    result.cook.should.have.property('firstName');
                    result.cook.should.have.property('lastName');
                    result.cook.should.have.property('isActive');
                    result.cook.should.have.property('street');
                    result.cook.should.have.property('city');
                    result.cook.should.have.property('emailAdress');
                    result.cook.should.have.property('password');
                    result.cook.should.have.property('phoneNumber');
                    result.cook.should.have.property('roles');
                    result.participants[0].should.have.property('id');
                    result.participants[0].should.have.property('firstName');
                    result.participants[0].should.have.property('lastName');
                    result.participants[0].should.have.property('isActive');
                    result.participants[0].should.have.property('street');
                    result.participants[0].should.have.property('city');
                    result.participants[0].should.have.property('emailAdress');
                    result.participants[0].should.have.property('password');
                    result.participants[0].should.have.property('phoneNumber');
                    result.participants[0].should.have.property('roles');
                    // Those keys should have those values
                    result.id.should.equal(result.id);
                    result.name.should.equal('Meal A XXL');
                    result.description.should.equal('description');
                    result.isActive.should.equal(true);
                    result.isVega.should.equal(false);
                    result.isVegan.should.equal(false);
                    result.isToTakeHome.should.equal(true);
                    result.dateTime.should.equal(result.dateTime);
                    result.createDate.should.equal(result.createDate);
                    result.updateDate.should.equal(result.updateDate);
                    result.imageUrl.should.equal('image url');
                    result.maxAmountOfParticipants.should.equal(5);
                    result.price.should.equal(6.5);
                    result.allergenes[0].should.equal('gluten');
                    result.cook.id.should.equal(1);
                    result.cook.firstName.should.equal('first');
                    result.cook.lastName.should.equal('last');
                    result.cook.isActive.should.equal(false);
                    result.cook.street.should.equal('street');
                    result.cook.city.should.equal('city');
                    result.cook.emailAdress.should.equal('test@server.nl');
                    result.cook.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result.cook.phoneNumber.should.equal('-');
                    result.cook.roles.should.equal('editor,guest');
                    result.participants[0].id.should.equal(1);
                    result.participants[0].firstName.should.equal('first');
                    result.participants[0].lastName.should.equal('last');
                    result.participants[0].isActive.should.equal(false);
                    result.participants[0].street.should.equal('street');
                    result.participants[0].city.should.equal('city');
                    result.participants[0].emailAdress.should.equal('test@server.nl');
                    result.participants[0].password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result.participants[0].phoneNumber.should.equal('-');
                    result.participants[0].roles.should.equal('editor,guest');
                    result.participants[1].id.should.equal(2);
                    result.participants[1].firstName.should.equal('first2');
                    result.participants[1].lastName.should.equal('last2');
                    result.participants[1].isActive.should.equal(false);
                    result.participants[1].street.should.equal('street2');
                    result.participants[1].city.should.equal('city2');
                    result.participants[1].emailAdress.should.equal('test2@server.nl');
                    result.participants[1].password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result.participants[1].phoneNumber.should.equal('-');
                    result.participants[1].roles.should.equal('editor,guest');
                    done();
                });
        });
    });

    describe('UC-303 Get list of all meals', () => {
        it('TC-303-1 List of all meals returned', (done) => {
            chai.request(server)
                .get('/api/meal')
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'result')
                    let { status, result } = res.body;
                    status.should.equals(200);
                    // Result should have those keys
                    // Meal A
                    result[0].should.have.property('id');
                    result[0].should.have.property('name'),
                    result[0].should.have.property('description')
                    result[0].should.have.property('isActive');
                    result[0].should.have.property('isVega');
                    result[0].should.have.property('isVegan');
                    result[0].should.have.property('isToTakeHome');
                    result[0].should.have.property('dateTime');
                    result[0].should.have.property('createDate');
                    result[0].should.have.property('updateDate');
                    result[0].should.have.property('imageUrl');
                    result[0].should.have.property('maxAmountOfParticipants');
                    result[0].should.have.property('price');
                    result[0].should.have.property('allergenes');
                    result[0].cook.should.have.property('id');
                    result[0].cook.should.have.property('firstName');
                    result[0].cook.should.have.property('lastName');
                    result[0].cook.should.have.property('isActive');
                    result[0].cook.should.have.property('street');
                    result[0].cook.should.have.property('city');
                    result[0].cook.should.have.property('emailAdress');
                    result[0].cook.should.have.property('password');
                    result[0].cook.should.have.property('phoneNumber');
                    result[0].cook.should.have.property('roles');
                    result[0].participants[0].should.have.property('id');
                    result[0].participants[0].should.have.property('firstName');
                    result[0].participants[0].should.have.property('lastName');
                    result[0].participants[0].should.have.property('isActive');
                    result[0].participants[0].should.have.property('street');
                    result[0].participants[0].should.have.property('city');
                    result[0].participants[0].should.have.property('emailAdress');
                    result[0].participants[0].should.have.property('password');
                    result[0].participants[0].should.have.property('phoneNumber');
                    result[0].participants[0].should.have.property('roles');
                    // Meal B
                    result[1].should.have.property('id');
                    result[1].should.have.property('name'),
                    result[1].should.have.property('description')
                    result[1].should.have.property('isActive');
                    result[1].should.have.property('isVega');
                    result[1].should.have.property('isVegan');
                    result[1].should.have.property('isToTakeHome');
                    result[1].should.have.property('dateTime');
                    result[1].should.have.property('createDate');
                    result[1].should.have.property('updateDate');
                    result[1].should.have.property('imageUrl');
                    result[1].should.have.property('maxAmountOfParticipants');
                    result[1].should.have.property('price');
                    result[1].should.have.property('allergenes');
                    result[1].cook.should.have.property('id');
                    result[1].cook.should.have.property('firstName');
                    result[1].cook.should.have.property('lastName');
                    result[1].cook.should.have.property('isActive');
                    result[1].cook.should.have.property('street');
                    result[1].cook.should.have.property('city');
                    result[1].cook.should.have.property('emailAdress');
                    result[1].cook.should.have.property('password');
                    result[1].cook.should.have.property('phoneNumber');
                    result[1].cook.should.have.property('roles');
                    result[1].participants[0].should.have.property('id');
                    result[1].participants[0].should.have.property('firstName');
                    result[1].participants[0].should.have.property('lastName');
                    result[1].participants[0].should.have.property('isActive');
                    result[1].participants[0].should.have.property('street');
                    result[1].participants[0].should.have.property('city');
                    result[1].participants[0].should.have.property('emailAdress');
                    result[1].participants[0].should.have.property('password');
                    result[1].participants[0].should.have.property('phoneNumber');
                    result[1].participants[0].should.have.property('roles');
                    // Those keys should have those values
                    // Meal A
                    result[0].id.should.equal(1);
                    result[0].name.should.equal('Meal A');
                    result[0].description.should.equal('description');
                    result[0].isActive.should.equal(true);
                    result[0].isVega.should.equal(false);
                    result[0].isVegan.should.equal(false);
                    result[0].isToTakeHome.should.equal(false);
                    result[0].dateTime.should.equal(result[0].dateTime);
                    result[0].createDate.should.equal(result[0].createDate);
                    result[0].updateDate.should.equal(result[0].updateDate);
                    result[0].imageUrl.should.equal('image url');
                    result[0].maxAmountOfParticipants.should.equal(5);
                    result[0].price.should.equal(6.5);
                    result[0].allergenes[0].should.equal('');
                    result[0].cook.id.should.equal(1);
                    result[0].cook.firstName.should.equal('first');
                    result[0].cook.lastName.should.equal('last');
                    result[0].cook.isActive.should.equal(false);
                    result[0].cook.street.should.equal('street');
                    result[0].cook.city.should.equal('city');
                    result[0].cook.emailAdress.should.equal('test@server.nl');
                    result[0].cook.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result[0].cook.phoneNumber.should.equal('-');
                    result[0].cook.roles.should.equal('editor,guest');
                    result[0].participants[0].id.should.equal(1);
                    result[0].participants[0].firstName.should.equal('first');
                    result[0].participants[0].lastName.should.equal('last');
                    result[0].participants[0].isActive.should.equal(false);
                    result[0].participants[0].street.should.equal('street');
                    result[0].participants[0].city.should.equal('city');
                    result[0].participants[0].emailAdress.should.equal('test@server.nl');
                    result[0].participants[0].password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result[0].participants[0].phoneNumber.should.equal('-');
                    result[0].participants[0].roles.should.equal('editor,guest');
                    result[0].participants[1].id.should.equal(2);
                    result[0].participants[1].firstName.should.equal('first2');
                    result[0].participants[1].lastName.should.equal('last2');
                    result[0].participants[1].isActive.should.equal(false);
                    result[0].participants[1].street.should.equal('street2');
                    result[0].participants[1].city.should.equal('city2');
                    result[0].participants[1].emailAdress.should.equal('test2@server.nl');
                    result[0].participants[1].password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result[0].participants[1].phoneNumber.should.equal('-');
                    result[0].participants[1].roles.should.equal('editor,guest');
                    // Meal B
                    result[1].id.should.equal(2);
                    result[1].name.should.equal('Meal B');
                    result[1].description.should.equal('description');
                    result[1].isActive.should.equal(true);
                    result[1].isVega.should.equal(false);
                    result[1].isVegan.should.equal(false);
                    result[1].isToTakeHome.should.equal(false);
                    result[1].dateTime.should.equal(result[0].dateTime);
                    result[1].createDate.should.equal(result[0].createDate);
                    result[1].updateDate.should.equal(result[0].updateDate);
                    result[1].imageUrl.should.equal('image url');
                    result[1].maxAmountOfParticipants.should.equal(5);
                    result[1].price.should.equal(6.5);
                    result[1].allergenes[0].should.equal('');
                    result[1].cook.id.should.equal(2);
                    result[1].cook.firstName.should.equal('first2');
                    result[1].cook.lastName.should.equal('last2');
                    result[1].cook.isActive.should.equal(false);
                    result[1].cook.street.should.equal('street2');
                    result[1].cook.city.should.equal('city2');
                    result[1].cook.emailAdress.should.equal('test2@server.nl');
                    result[1].cook.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result[1].cook.phoneNumber.should.equal('-');
                    result[1].cook.roles.should.equal('editor,guest');
                    result[1].participants[0].id.should.equal(2);
                    result[1].participants[0].firstName.should.equal('first2');
                    result[1].participants[0].lastName.should.equal('last2');
                    result[1].participants[0].isActive.should.equal(false);
                    result[1].participants[0].street.should.equal('street2');
                    result[1].participants[0].city.should.equal('city2');
                    result[1].participants[0].emailAdress.should.equal('test2@server.nl');
                    result[1].participants[0].password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result[1].participants[0].phoneNumber.should.equal('-');
                    result[1].participants[0].roles.should.equal('editor,guest');
                    done();
                });
        });
    });

    describe('UC-304 Get details of a specific meal', () => {
        it('TC-304-1 Meal doesnt exist', (done) => {
            chai.request(server)
                // Meal doesnt exist
                .get('/api/meal/0')
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message')
                    let { status, message } = res.body;
                    status.should.equals(404);
                    message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
                    done();
                });
        });
        it('TC-304-2 Details of a specific meal returned', (done) => {
            chai.request(server)
                .get('/api/meal/2')
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'result')
                    let { status, result } = res.body;
                    status.should.equals(200);
                    // Result should have those keys
                    result.should.have.property('id');
                    result.should.have.property('name'),
                    result.should.have.property('description')
                    result.should.have.property('isActive');
                    result.should.have.property('isVega');
                    result.should.have.property('isVegan');
                    result.should.have.property('isToTakeHome');
                    result.should.have.property('dateTime');
                    result.should.have.property('createDate');
                    result.should.have.property('updateDate');
                    result.should.have.property('imageUrl');
                    result.should.have.property('maxAmountOfParticipants');
                    result.should.have.property('price');
                    result.should.have.property('allergenes');
                    result.cook.should.have.property('id');
                    result.cook.should.have.property('firstName');
                    result.cook.should.have.property('lastName');
                    result.cook.should.have.property('isActive');
                    result.cook.should.have.property('street');
                    result.cook.should.have.property('city');
                    result.cook.should.have.property('emailAdress');
                    result.cook.should.have.property('password');
                    result.cook.should.have.property('phoneNumber');
                    result.cook.should.have.property('roles');
                    result.participants[0].should.have.property('id');
                    result.participants[0].should.have.property('firstName');
                    result.participants[0].should.have.property('lastName');
                    result.participants[0].should.have.property('isActive');
                    result.participants[0].should.have.property('street');
                    result.participants[0].should.have.property('city');
                    result.participants[0].should.have.property('emailAdress');
                    result.participants[0].should.have.property('password');
                    result.participants[0].should.have.property('phoneNumber');
                    result.participants[0].should.have.property('roles');
                    // Those keys should have those values
                    result.id.should.equal(2);
                    result.name.should.equal('Meal B');
                    result.description.should.equal('description');
                    result.isActive.should.equal(true);
                    result.isVega.should.equal(false);
                    result.isVegan.should.equal(false);
                    result.isToTakeHome.should.equal(false);
                    result.dateTime.should.equal(result.dateTime);
                    result.createDate.should.equal(result.createDate);
                    result.updateDate.should.equal(result.updateDate);
                    result.imageUrl.should.equal('image url');
                    result.maxAmountOfParticipants.should.equal(5);
                    result.price.should.equal(6.5);
                    result.allergenes[0].should.equal('');
                    result.cook.id.should.equal(2);
                    result.cook.firstName.should.equal('first2');
                    result.cook.lastName.should.equal('last2');
                    result.cook.isActive.should.equal(false);
                    result.cook.street.should.equal('street2');
                    result.cook.city.should.equal('city2');
                    result.cook.emailAdress.should.equal('test2@server.nl');
                    result.cook.password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result.cook.phoneNumber.should.equal('-');
                    result.cook.roles.should.equal('editor,guest');
                    result.participants[0].id.should.equal(2);
                    result.participants[0].firstName.should.equal('first2');
                    result.participants[0].lastName.should.equal('last2');
                    result.participants[0].isActive.should.equal(false);
                    result.participants[0].street.should.equal('street2');
                    result.participants[0].city.should.equal('city2');
                    result.participants[0].emailAdress.should.equal('test2@server.nl');
                    result.participants[0].password.should.equal('$2b$10$Knhkqh3u.SclJv4P6E0iqeUckIPUdEjv3pvHWtrYkEjkfcg4h2eoW');
                    result.participants[0].phoneNumber.should.equal('-');
                    result.participants[0].roles.should.equal('editor,guest');
                    done();
                });
        });
    });

    describe('UC-305 Delete meal', () => {
        it('TC-305-2 Not logged in', (done) => {
            chai.request(server)
                .delete('/api/meal/1')
                // User not logged in
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
        it('TC-304-3 Not owner of the data', (done) => {
            chai.request(server)
                .delete('/api/meal/1')
                // Not the owner of the data
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey)
                )
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message')
                    let { status, message } = res.body;
                    status.should.equals(403);
                    message.should.be.a('string').that.equals('Not the owner of the data!');
                    done();
                });
        });
        it('TC-304-4 Meal doesnt exist', (done) => {
            chai.request(server)
                // Meal doesnt exist
                .delete('/api/meal/0')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message')
                    let { status, message } = res.body;
                    status.should.equals(404);
                    message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
                    done();
                });
        });
        it('TC-304-5 Meal has been deleted successfully', (done) => {
            chai.request(server)
                .delete('/api/meal/1')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message')
                    let { status, message } = res.body;
                    status.should.equals(200);
                    message.should.be.a('string').that.equals('Meal has been removed!');
                    done();
                });
        });
    });

    describe('UC-401 Participate meal', () => {
        it('TC-401-1 Not logged in', (done) => {
            chai.request(server)
                .get('/api/meal/1/participate')
                // User not logged in
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
        it('TC-401-2 Meal doesnt exist', (done) => {
            chai.request(server)
                // Meal doesnt exist
                .get('/api/meal/0/participate')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message')
                    let { status, message } = res.body;
                    status.should.equals(404);
                    message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
                    done();
                });
        });
        it('TC-401-3 Participated successfully', (done) => {
            chai.request(server)
                .get('/api/meal/2/participate')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'result')
                    let { status, result } = res.body;
                    status.should.equals(200);
                    // Result should have those keys
                    result.should.have.property('currentlyParticipating');
                    result.should.have.property('currentAmountOfParticipants'),
                    // Those keys should have those values
                    result.currentlyParticipating.should.equal(true);
                    result.currentAmountOfParticipants.should.equal(2);
                    done();
                });
        });
    });

    describe('UC-402 Unsubcribe meal', () => {
        it('TC-402-1 Not logged in', (done) => {
            chai.request(server)
                .get('/api/meal/1/participate')
                // User not logged in
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
        it('TC-402-2 Meal doesnt exist', (done) => {
            chai.request(server)
                // Meal doesnt exist
                .get('/api/meal/0/participate')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'message')
                    let { status, message } = res.body;
                    status.should.equals(404);
                    message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
                    done();
                });
        });
        it('TC-402-3 Unsubcribe successfully', (done) => {
            chai.request(server)
                .get('/api/meal/1/participate')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey)
                )
                .end((req, res) => {
                    res.body.should.be
                            .an('object')
                            .that.has.all.keys('status', 'result')
                    let { status, result } = res.body;
                    status.should.equals(200);
                    // Result should have those keys
                    result.should.have.property('currentlyParticipating');
                    result.should.have.property('currentAmountOfParticipants'),
                    // Those keys should have those values
                    result.currentlyParticipating.should.equal(false);
                    result.currentAmountOfParticipants.should.equal(1);
                    done();
                });
        });
    });
});