// Default settings
const assert = require('assert');
const dbconnection = require('../../database/dbconnection');

// Create an UserController
let userController = {
    validateCreatedUser: (req, res, next) => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        let user = req.body;
        let { firstName, lastName, emailAdress, password, phoneNumber, street, city } = user;
        try {
            assert(typeof firstName === 'string', 'firstName must be a string!');
            assert(typeof lastName === 'string', 'lastName must be a string!');
            assert(typeof emailAdress === 'string', 'emailAdress must be a string!');
            assert(emailAdress.match(emailRegex), 'emailAdress is not valid!');
            assert(typeof password === 'string', 'password must be a string!');
            assert(password.match(passwordRegex), 'password is not valid!');
            assert(typeof phoneNumber === 'string', 'phoneNumber must be a string!');
            assert(typeof street === 'string', 'street must be a string!');
            assert(typeof city === 'string', 'city must be a string!');
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
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
           
            connection.query('SELECT * FROM user', function (error, results, fields) {
                connection.release();
            
                if (error) throw error;

                if(res.statusCode >= 200 && res.statusCode <= 299) {
                    res.status(200).json({
                        status: 200,
                        result: results
                    });
                } else {
                    res.status(401).json({
                        status: 401,
                        result: 'Forbidden'
                    });
                }
                res.end();
            });
        });
    },
    addUser: (req, res) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;

            let user = req.body;
                user = {
                    ...user
                }
            
                connection.query('INSERT INTO user (firstName, lastName, emailAdress, password, phoneNumber, street, city) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                                [user.firstName, user.lastName, user.emailAdress, user.password, user.phoneNumber, user.street, user.city], 
                                function (error, results, fields) {
                    connection.release();

                    if (error) throw error;

                    if(res.statusCode >= 200 && res.statusCode <= 299) {
                        res.status(201).json({
                            status: 201,
                            result: results
                        });
                    } else {
                        res.status(401).json({
                            status: 401,
                            result: 'Forbidden'
                        });
                    }
                });
            res.end();
        });
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
    getUserById: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
           
            const userId = req.params.userId;

            if (isNaN(userId)) {
                return next();
            }

            connection.query('SELECT * FROM user WHERE id = ?', userId, function (error, results, fields) {
                connection.release();
            
                if (error) throw error;

                if(res.statusCode >= 200 && res.statusCode <= 299) {
                    res.status(200).json({
                        status: 200,
                        result: results
                    });
                } else {
                    res.status(401).json({
                        status: 401,
                        result: 'Forbidden'
                    });
                }
                res.end();
            });
        });
    },
    updateUserById: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;

            const userId = req.params.userId;

            if (isNaN(userId)) {
                return next();
            }

            let updatedUser = req.body;
                updatedUser = {
                    ...updatedUser
                }
           
            connection.query('UPDATE user SET firstName = ?, lastName = ?, emailAdress = ?, password = ?, phoneNumber = ?, street = ?, city = ? WHERE id = ?',
                            [updatedUser.firstName, updatedUser.lastName, updatedUser.emailAdress, updatedUser.password, updatedUser.phoneNumber, updatedUser.street, updatedUser.city, userId], 
                            function (error, results, fields) {
                connection.release();
            
                if (error) throw error;

                if(res.statusCode >= 200 && res.statusCode <= 299) {
                    res.status(201).json({
                        status: 201,
                        result: results
                    });
                } else {
                    res.status(401).json({
                        status: 401,
                        result: 'Forbidden'
                    });
                }
                res.end();
            });
        });
    },
    deleteUserById: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;

            const userId = req.params.userId;

            if (isNaN(userId)) {
                return next();
            }
           
            connection.query('DELETE FROM user WHERE id = ?', userId, function (error, results, fields) {
                connection.release();
            
                if (error) throw error;

                if(res.statusCode >= 200 && res.statusCode <= 299) {
                    res.status(201).json({
                        status: 201,
                        result: results
                    });
                } else {
                    res.status(401).json({
                        status: 401,
                        result: 'Forbidden'
                    });
                }
                res.end();
            });
        });
    }
};

module.exports = userController;