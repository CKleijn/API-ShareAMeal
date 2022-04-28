// Default settings
const assert = require('assert');

// Create a database array and sort it on id
let database = 
[
    { 
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        street: 'Lovensdijkstraat 61',
        city: 'Breda',
        isActive: true,
        emailAdress: 'john.doe@server.com',
        password: 'pAssw0rd',
        phoneNumber: '06 12425475'  
    },
    { 
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        street: 'Hogeschoollaan 32',
        city: 'Breda',
        isActive: true,
        emailAdress: 'jane.doe@server.com',
        password: 'paSsw0rd',
        phoneNumber: '06 87654321'  
    },
].sort(function (x, y) {
    return x.id - y.id
});

let id = 2;

// Create an UserController
let userController = {
    validateCreatedUser: (req, res, next) => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        let user = req.body;
        let { firstName, lastName, street, city, isActive, emailAdress, password, phoneNumber } = user;
        try {
            assert((database.filter((item) => item.emailAdress == req.body.emailAdress).length === 0), 'User already exists!');
            assert(typeof firstName === 'string', 'firstName must be a string!');
            assert(typeof lastName === 'string', 'lastName must be a string!');
            assert(typeof street === 'string', 'street must be a string!');
            assert(typeof city === 'string', 'city must be a string!');
            assert(typeof isActive === 'boolean', 'isActive must be a boolean!');
            assert(typeof emailAdress === 'string', 'emailAdress must be a string!');
            assert(emailAdress.match(emailRegex), 'emailAdress is not valid!');
            assert(typeof password === 'string', 'password must be a string!');
            assert(password.match(passwordRegex), 'password is not valid!');
            assert(typeof phoneNumber === 'string', 'phoneNumber must be a string!');
            next();
        } catch (err) {
            const error = {
                status: 400,
                result: err.message
            };
            next(error);
        }
    },
    getAllUsers: (req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            res.status(200).json({
                status: 200,
                result: database
            });
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            });
        }
        res.end();
    },
    addUser: (req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            let user = req.body;
            id++;
            user = {
                id,
                ...user
            }
            database.push(user);
            res.status(201).json({
                status: 201,
                result: user
            });
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            });
        }
        res.end();
    },
    getUserProfile: (req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            res.status(200).json({
                status: 200,
                result: 'End-point not realised yet'
            });
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            });
        }
        res.end();
    },
    getUserById: (req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            const userId = req.params.userId;
            if (isNaN(userId)) {
                res.status(404).json({
                    status: 404,
                    result: 'End-point not found'
                });
            }
            let user = database.filter((item) => item.id == userId);
            if(user.length > 0) {
                res.status(200).json({
                    status: 200,
                    result: user
                });
            } else {
                res.status(404).json({
                    status: 404,
                    result: 'None of the users got an id of ' + userId
                });
            }
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            });
        }
        res.end();
    },
    updateUserById: (req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            const userId = req.params.userId;
            if (isNaN(userId)) {
                res.status(404).json({
                    status: 404,
                    result: 'End-point not found'
                });
            }
            let user = database.filter((item) => item.id == userId);
            let id = parseInt(userId);
            if(user.length > 0) {
                let updatedUser = req.body;
                let isUsed = false;
                database.forEach(item => {
                    if(item.emailAdress == updatedUser.emailAdress) {
                        isUsed = true;
                    }
                });
                if(!isUsed) {
                    updatedUser = {
                        id,
                        ...updatedUser
                    }
                    database[database.findIndex((item) => item.id == userId)] = updatedUser;
                    res.status(201).json({
                        status: 201,
                        result: database
                    });
                } else {
                    res.status(409).json({
                        status: 409,
                        result: updatedUser.emailAdress + ' is not unique'
                    });
                }
            } else {
                res.status(404).json({
                    status: 404,
                    result: 'None of the users got an id of ' + userId
                });
            }
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            });
        }
        res.end();
    },
    deleteUserById: (req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            const userId = req.params.userId;
            if (isNaN(userId)) {
                res.status(404).json({
                    status: 404,
                    result: 'End-point not found'
                });
            }
            let user = database.filter((item) => item.id == userId);
            if(user.length > 0) {
                database = database.filter((item) => item.id != userId);
                res.status(201).json({
                    status: 201,
                    result: database
                });
            } else {
                res.status(404).json({
                    status: 404,
                    result: 'None of the users got an id of ' + userId
                });
            }
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            });
        }
        res.end();
    }
};

module.exports = userController;