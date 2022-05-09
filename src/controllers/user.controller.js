// Default settings
const assert = require('assert');
const dbconnection = require('../../database/dbconnection');

// Create an UserController
let userController = {
    validateCreateUser: (req, res, next) => {
        // const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        let user = req.body;
        let { firstName, lastName, emailAdress, password, street, city } = user;
        try {
            assert(typeof firstName === 'string', 'firstName must be a string!');
            assert(typeof lastName === 'string', 'lastName must be a string!');
            assert(typeof emailAdress === 'string', 'emailAdress must be a string!');
            // assert(emailAdress.match(emailRegex), 'emailAdress is not valid!');
            assert(typeof password === 'string', 'password must be a string!');
            // assert(password.match(passwordRegex), 'password is not valid!');
            assert(typeof street === 'string', 'street must be a string!');
            assert(typeof city === 'string', 'city must be a string!');
            next();
        } catch (err) {
            return next({
                status: 400,
                message: err.message
            });
        }
    },
    validateUpdateUser: (req, res, next) => {
        // const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        // const phoneNumberRegex = /([\d] *){10}/;
        let user = req.body;
        let { firstName, lastName, emailAdress, password, street, city } = user;
        try {
            assert(typeof firstName === 'string', 'firstName must be a string!');
            assert(typeof lastName === 'string', 'lastName must be a string!');
            assert(typeof emailAdress === 'string', 'emailAdress must be a string!');
            // assert(emailAdress.match(emailRegex), 'emailAdress is not valid!');
            assert(typeof password === 'string', 'password must be a string!');
            // assert(password.match(passwordRegex), 'password is not valid!');
            // assert(typeof phoneNumber === 'string', 'phoneNumber must be a string!');
            // assert(phoneNumber.match(phoneNumberRegex), 'phoneNumber is not valid!');
            assert(typeof street === 'string', 'street must be a string!');
            assert(typeof city === 'string', 'city must be a string!');
            next();
        } catch (err) {
            return next({
                status: 400,
                message: err.message
            });
        }
    },
    getAllUsers: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;

            if(Object.keys(req.query).length === 0) {
                connection.query('SELECT * FROM user', function (err, results, fields) {
                    connection.release();
                
                    if (err) throw err;
    
                    if(res.statusCode >= 200 && res.statusCode <= 299) {
                        res.status(200).json({
                            status: 200,
                            result: results
                        });
                        res.end();
                    } else {
                        res.status(401);
                        return next({
                            status: 401,
                            message: 'Forbidden'
                        });
                    }
                });
            } else if(req.query.limit) {
                if (isNaN(req.query.limit)) {
                    return next();
                }

                connection.query('SELECT * FROM user LIMIT ?', Number.parseInt(req.query.limit), function (err, results, fields) {
                    connection.release();
                
                    if (err) throw err;
    
                    if(res.statusCode >= 200 && res.statusCode <= 299) {
                        res.status(200).json({
                            status: 200,
                            result: results
                        });
                        res.end();
                    } else {
                        res.status(401);
                        return next({
                            status: 401,
                            message: 'Forbidden'
                        });
                    }
                });
            } else if(req.query.firstName) {
                if (typeof req.query.firstName !== 'string') {
                    return next();
                }

                connection.query('SELECT * FROM user WHERE firstName = ?', req.query.firstName, function (err, results, fields) {
                    connection.release();
                
                    if (err) throw err;
    
                    if(res.statusCode >= 200 && res.statusCode <= 299) {
                        res.status(200).json({
                            status: 200,
                            result: results
                        });
                        res.end();
                    } else {
                        res.status(401);
                        return next({
                            status: 401,
                            message: 'Forbidden'
                        });
                    }
                });
            } else if(req.query.isActive) {
                let isActive;

                if(req.query.isActive === 'true') {
                    isActive = true;
                } else if(req.query.isActive === 'false'){
                    isActive = false;
                } else {
                    return next();
                }

                connection.query('SELECT * FROM user WHERE isActive = ?', isActive, function (err, results, fields) {
                    connection.release();
                
                    if (err) throw err;
    
                    if(res.statusCode >= 200 && res.statusCode <= 299) {
                        res.status(200).json({
                            status: 200,
                            result: results
                        });
                        res.end();
                    } else {
                        res.status(401);
                        return next({
                            status: 401,
                            message: 'Forbidden'
                        });
                    }
                });
            } else {
                return next({
                    status: 400
                });
            }
        });
    },
    addUser: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;

            let user = req.body;
                user = {
                    ...user
                }
                
            connection.query('SELECT COUNT(emailAdress) as count FROM user WHERE emailAdress = ?', user.emailAdress, function (err, results, fields) {
                if (err) throw err;

                if(results[0].count === 0) {
                    connection.query('INSERT INTO user (firstName, lastName, emailAdress, password, street, city) VALUES (?, ?, ?, ?, ?, ?)', 
                                [user.firstName, user.lastName, user.emailAdress, user.password, user.street, user.city], function (err, results, fields) {
                        connection.release();

                        if (err) throw err;

                        if(res.statusCode >= 200 && res.statusCode <= 299) {
                            res.status(201).json({
                                status: 201,
                                result: user
                            });
                            res.end();
                        } else {
                            res.status(401);
                            return next({
                                status: 401,
                                message: 'Forbidden'
                            });
                        }
                    });
                } else {
                    res.status(409);
                    return next({
                        status: 409,
                        message: 'User already exist!'
                    });
                }
            });
        });
    },
    getUserProfile: (req, res, next) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            res.status(200).json({
                status: 200,
                result: 'End-point not realised yet'
            });
            res.end();
        } else {
            res.status(401);
            return next({
                status: 401,
                message: 'Forbidden'
            });
        }
    },
    getUserById: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
           
            const userId = req.params.userId;

            if (isNaN(userId)) {
                return next();
            }

            connection.query('SELECT * FROM user WHERE id = ?', userId, function (err, results, fields) {
                connection.release();
            
                if (err) throw err;

                if(results.length > 0) {
                    if(res.statusCode >= 200 && res.statusCode <= 299) {
                        res.status(200).json({
                            status: 200,
                            result: results
                        });
                        res.end();
                    } else {
                        res.status(401);
                        return next({
                            status: 401,
                            message: 'Forbidden'
                        });
                    }
                } else {
                    res.status(404);
                    return next({
                        status: 404,
                        message: 'User does not exist with the id of ' + userId
                    });
                }
            });
        });
    },
    updateUserById: (req, res, next) => {
        // dbconnection.getConnection(function(err, connection) {
        //     if (err) throw err;

        //     const userId = req.params.userId;

        //     if (isNaN(userId)) {
        //         return next();
        //     }

        //     let updatedUser = req.body;
        //         updatedUser = {
        //             ...updatedUser
        //         }

        //     connection.query('SELECT * FROM user WHERE id = ?', userId, function (err, results, fields) {
        //         if (err) throw err;

        //         if(results.length > 0) {
        //             connection.query('SELECT COUNT(emailAdress) as count FROM user WHERE emailAdress = ?', updatedUser.emailAdress, function (err, results, fields) {
        //                 if (err) throw err;
        
        //                 if(results[0].count === 0) {
        //                     connection.query('UPDATE user SET firstName = ?, lastName = ?, emailAdress = ?, password = ?, phoneNumber = ?, street = ?, city = ? WHERE id = ?',
        //                             [updatedUser.firstName, updatedUser.lastName, updatedUser.emailAdress, updatedUser.password, updatedUser.phoneNumber, updatedUser.street, updatedUser.city, userId], 
        //                             function (err, results, fields) {
        //                         connection.release();
        
        //                         if (err) throw err;
        
        //                         if(res.statusCode >= 200 && res.statusCode <= 299) {
        //                             res.status(200).redirect('/api/user/' + userId);
        //                             res.end();
        //                         } else {
        //                             res.status(401);
        //                             return next({
        //                                 status: 401,
        //                                 message: 'Forbidden'
        //                             });
        //                         }
        //                     });
        //                 } else {
        //                     res.status(409);
        //                     return next({
        //                         status: 409,
        //                         message: 'User already exist!'
        //                     });
        //                 }
        //             });
        //         } else {
        //             res.status(400);
        //             return next({
        //                 status: 400,
        //                 message: 'User does not exist with the id of ' + userId
        //             });
        //         }
        //     });
        // });
    },
    deleteUserById: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;

            const userId = req.params.userId;

            if (isNaN(userId)) {
                return next();
            }

            connection.query('SELECT * FROM user WHERE id = ?', userId, function (err, results, fields) {
                if (err) throw err;

                if(results.length > 0) {
                    connection.query('DELETE FROM user WHERE id = ?', userId, function (err, results, fields) {
                        connection.release();
                    
                        if (err) throw err;
        
                        if(res.statusCode >= 200 && res.statusCode <= 299) {
                            res.status(200).redirect('/api/user');
                            res.end();
                        } else {
                            res.status(401);
                            return next({
                                status: 401,
                                message: 'Forbidden'
                            });
                        }
                    });
                } else {
                    res.status(400);
                    return next({
                        status: 400,
                        message: 'User does not exist with the id of ' + userId
                    });
                }
            });
        });
    }
};

module.exports = userController;