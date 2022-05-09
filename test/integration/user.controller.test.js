process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb';

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
                firstName: 'Henk',
                lastName: 'Tank',
                street: 'Hogeschoollaan 99',
                city: 'Breda',
                emailAdress: 'h.tank@server.com',
                password: 'paSsw00rd'
            })
            .end((req, res) => {
                res.should.be.an('object');
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
                let { status, result } = res.body;
                status.should.equals(201);
                createdUserId = result.insertId
                done();
            });
    });
});

// describe('UC-202 Overview of users', () => {
//     it('TC-202-1 Show zero users', (done) => {
//         chai.request(server)
//             .get('/api/user')
//             .query({limit: 0})
//             .end((req, res) => {
//                 res.should.be.an('object');
//                 let { status } = res.body;
//                 status.should.equals(200);
//                 done();
//             });
//     });
//     it('TC-202-2 Show two users', (done) => {
//         chai.request(server)
//             .get('/api/user')
//             .query({limit: 2})
//             .end((req, res) => {
//                 res.should.be.an('object');
//                 let { status } = res.body;
//                 status.should.equals(200);
//                 done();
//             });
//     });
//     it('TC-202-3 Show users with search term by non-existent name', (done) => {
//         chai.request(server)
//             .get('/api/user')
//             .query({firstName: 'Jonas'})
//             .end((req, res) => {
//                 res.should.be.an('object');
//                 let { status } = res.body;
//                 status.should.equals(200);
//                 done();
//             });
//     });
//     it('TC-202-4 Show users using the search term in the field isActive = false', (done) => {
//         chai.request(server)
//             .get('/api/user')
//             .query({isActive: 'false'})
//             .end((req, res) => {
//                 res.should.be.an('object');
//                 let { status } = res.body;
//                 status.should.equals(200);
//                 done();
//             });
//     });
//     it('TC-202-5 Show users using the search term in the field isActive = true', (done) => {
//         chai.request(server)
//             .get('/api/user')
//             .query({isActive: 'true'})
//             .end((req, res) => {
//                 res.should.be.an('object');
//                 let { status } = res.body;
//                 status.should.equals(200);
//                 done();
//             });
//     });
//     it('TC-202-6 Show users with search term by existing name', (done) => {
//         chai.request(server)
//             .get('/api/user')
//             .query({firstName: 'Jake'})
//             .end((req, res) => {
//                 res.should.be.an('object');
//                 let { status } = res.body;
//                 status.should.equals(200);
//                 done();
//             });
//     });
// });

// describe('UC-203 User profile request', () => {
//     it('TC-203-1 Invalid token', (done) => {
//         chai.request(server)
//             .get('/api/user/profile')
//             .end((req, res) => {
//                 res.should.be.an('object');
//                 let { status, result } = res.body;
//                 status.should.equals(404);
//                 result.should.be.a('string').that.equals('Invalid token!');
//                 done();
//             });
//     });
//     it('TC-203-2 Valid token and user exists', (done) => {
//         chai.request(server)
//             .get('/api/user/profile')
//             .end((req, res) => {
//                 res.should.be.an('object');
//                 let { status, result } = res.body;
//                 status.should.equals(200);
//                 done();
//             });
//     });
// });

describe('UC-204 Details of user', () => {
    // it('TC-204-1 Invalid token', (done) => {
    //     chai.request(server)
    //         .put('/api/user/1')
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, result } = res.body;
    //             status.should.equals(404);
    //             result.should.be.a('string').that.equals('Invalid token!');
    //             done();
    //         });
    // });
    it('TC-204-2 User-ID doesnt exist', (done) => {
        chai.request(server)
            .get('/api/user/0')
            .end((req, res) => {
                res.should.be.an('object');
                let { status, message } = res.body;
                status.should.equals(404);
                message.should.be.a('string').that.equals('User does not exist with the id of 0');
                done();
            });
    });
    it('TC-204-3 User-ID exist', (done) => {
        chai.request(server)
            .get('/api/user/1')
            .end((req, res) => {
                res.should.be.an('object');
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
                // firstName is missing
                lastName: 'Doe',
                street: 'Hogeschoollaan 5',
                city: 'Breda',
                emailAdress: 'jaxe.doe@server.com',
                password: 'Passw0rd',
                phoneNumber: '06 43643761'  
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('firstName must be a string!');
                done();
            });
    });
    // it('TC-205-2 Postal code is not valid', (done) => {
    //     chai.request(server)
    //         .put('/api/user/1')
    //         .send({
    //             firstName: 'Jaze',
    //             lastName: 'Doe',
    //             street: 'Hogeschoollaan 45',
    //             city: 'Breda',
    //             isActive: true,
    //             // postalCode ???
    //             emailAdress: 'jaze.doe@server.com',
    //             password: 'Passw0rd',
    //             phoneNumber: '06 43643761'  
    //         })
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, result } = res.body;
    //             status.should.equals(400);
    //             result.should.be.a('string').that.equals('postalCode is not valid!');
    //             done();
    //         });
    // });
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
                let { status, message } = res.body;
                status.should.equals(404);
                message.should.be.a('string').that.equals('User does not exist with the id of 0');
                done();
            });
    });
    // it('TC-205-5 Not logged in', (done) => {
    //     chai.request(server)
    //         .put('/api/user/1')
    //         .send({
    //             // User is not logged in
    //             firstName: 'Jake',
    //             lastName: 'Doe',
    //             street: 'Hogeschoollaan 53',
    //             city: 'Breda',
    //             isActive: true,
    //             emailAdress: 'jake.doe@server.com',
    //             password: 'Passw0rd',
    //             phoneNumber: '06 43643761'  
    //         })
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status } = res.body;
    //             status.should.equals(401);
    //             result.should.be.a('string').that.equals('Not logged in!');
    //             done();
    //         });
    // });
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
                let { status } = res.body;
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
                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('User does not exist with the id of 0');
                done();
            });
    });
    // it('TC-206-2 Not logged in', (done) => {
    //     chai.request(server)
    //         .delete('/api/user/1')
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, result } = res.body;
    //             status.should.equals(401);
    //             result.should.be.a('string').that.equals('Not logged in!');
    //             done();
    //         });
    // });
    // it('TC-206-3 Actor is not the owner', (done) => {
    //     chai.request(server)
    //         .delete('/api/user/1')
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status } = res.body;
    //             status.should.equals(401);
    //             result.should.be.a('string').that.equals('Actor is not the owner!');
    //             done();
    //         });
    // });
    it('TC-206-4 User has been deleted successfully', (done) => {
        chai.request(server)
            .delete('/api/user/' + createdUserId)
            .end((req, res) => {
                res.should.be.an('object');
                let { status } = res.body;
                status.should.equals(200);
                done();
            });
    });
});