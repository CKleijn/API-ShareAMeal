// Default settings
const assert = require('assert');
const dbconnection = require('../../database/dbconnection');

// Create an UserController
const userController = {
    // Create validation for POST
    validateCreateUser: (req, res, next) => {
        // Validation regex
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        // Get request and assign it as an user
        const user = req.body;
        const { firstName, lastName, emailAdress, password, street, city } = user;
        try {
            // Put assert on each key to create the validation
            assert(typeof firstName === 'string', 'firstName must be a string!');
            assert(typeof lastName === 'string', 'lastName must be a string!');
            assert(typeof emailAdress === 'string', 'emailAdress must be a string!');
            assert(emailAdress.match(emailRegex), 'emailAdress is not valid!');
            assert(typeof password === 'string', 'password must be a string!');
            assert(password.match(passwordRegex), 'password is not valid!');
            assert(typeof street === 'string', 'street must be a string!');
            assert(typeof city === 'string', 'city must be a string!');
            next();
        } catch (err) {
            // Return status + message to error handler
            return next({
                status: 400,
                message: err.message
            });
        }
    },
    // Create validation for PUT
    validateUpdateUser: (req, res, next) => {
        // Validation regex
        // const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        // const phoneNumberRegex = /([\d] *){10}/;
        // Get request and assign it as an user
        const user = req.body;
        const { emailAdress } = user;
        try {
            // Put assert on each key to create the validation
            assert(typeof emailAdress === 'string', 'emailAdress must be a string!');
            next();
        } catch (err) {
            // Return status + message to error handler
            return next({
                status: 400,
                message: err.message
            });
        }
    },
    // GET all users with query
    getAllUsers: (req, res, next) => {
        // Get query paramaters
        const { firstName, isActive, limit } = req.query;
        // Base query
        let queryString = 'SELECT * FROM user';
        // Check if there is a firstName or isActive paramater
        if(firstName || isActive) {
            queryString += ' WHERE ';
            // Check if there is a firstName paramater - if yes then add to query
            if(firstName) {
                queryString += 'firstName = "' + firstName + '"';
            }
            // Check if there is a firstName and an isActive paramater - if yes then add to query
            if(firstName && isActive) {
                queryString += ' AND ';
            }
            // Check if there is an isActive paramater - if yes then add to query
            if(isActive) {
                queryString += 'isActive = ' + isActive;
            }
        }
        // Check if there is a limit paramater - if yes then add to query
        if(limit) {
            queryString += ' LIMIT ' + limit;
        }
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get users with given filter
            connection.query(queryString, function (err, results, fields) {
                connection.release();
            
                if (err) throw err;

                if(res.statusCode >= 200 && res.statusCode <= 299) {
                    // Return JSON with response
                    res.status(200).json({
                        status: 200,
                        result: formatUser(results)
                    });
                    res.end();
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 401,
                        message: 'Forbidden'
                    });
                }
            });
        });
    },
    // POST user with given input
    addUser: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get request and assign it as an user
            const user = {
                ...req.body
            }
            // Check if emailAdress already exists
            connection.query('SELECT COUNT(emailAdress) as count FROM user WHERE emailAdress = ?', user.emailAdress, function (err, results, fields) {
                if (err) throw err;
                // If emailaddress is unique get into the if statement
                if(results[0].count === 0) {
                    // Create new user
                    connection.query('INSERT INTO user (firstName, lastName, emailAdress, password, street, city) VALUES (?, ?, ?, ?, ?, ?)', 
                                [user.firstName, user.lastName, user.emailAdress, user.password, user.street, user.city], function (err, results, fields) {

                        if (err) throw err;

                        if(res.statusCode >= 200 && res.statusCode <= 299) {
                            const userId = results.insertId;
                            // Get user with given userId
                            connection.query('SELECT * FROM user WHERE id = ?', userId, function (err, results, fields) { 
                                connection.release();

                                if (err) throw err;

                                // Return JSON with response
                                res.status(201).json({
                                    status: 201,
                                    message: 'User has been created!',
                                    result: formatUser(results)
                                });
                                res.end();
                            });
                        } else {
                            // Return status + message to error handler
                            return next({
                                status: 401,
                                message: 'Forbidden'
                            });
                        }
                    });
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 409,
                        message: 'User already exist!'
                    });
                }
            });
        });
    },
    // GET user profile with query
    getUserProfile: (req, res, next) => {
         // Open connection and throw an error if it exist
         dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get userId from JWT
            const userId = req.userId;
            // Get the user with the given userId
            connection.query('SELECT * FROM user WHERE id = ?', userId, function (err, results, fields) {
                connection.release();
            
                if (err) throw err;
                // If an user is found get into the if statement
                if(results.length > 0) {
                    if(res.statusCode >= 200 && res.statusCode <= 299) {
                        // Return JSON with response
                        res.status(200).json({
                            status: 200,
                            result: formatUser(results)
                        });
                        res.end();
                    } else {
                        // Return status + message to error handler
                        return next({
                            status: 401,
                            message: 'Forbidden'
                        });
                    }
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 404,
                        message: 'User does not exist'
                    });
                }
            });
        });
    },
    // GET user with given userId
    getUserById: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get userId paramater from URL
            const userId = req.params.userId;
            // Check if userId isnt a number
            if (isNaN(userId)) {
                return next();
            }
            // Get the user with the given userId
            connection.query('SELECT * FROM user WHERE id = ?', userId, function (err, results, fields) {
                connection.release();
            
                if (err) throw err;
                // If an user is found get into the if statement
                if(results.length > 0) {
                    if(res.statusCode >= 200 && res.statusCode <= 299) {
                        // Return JSON with response
                        res.status(200).json({
                            status: 200,
                            result: formatUser(results)
                        });
                        res.end();
                    } else {
                        // Return status + message to error handler
                        return next({
                            status: 401,
                            message: 'Forbidden'
                        });
                    }
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 404,
                        message: 'User does not exist'
                    });
                }
            });
        });
    },
    // PUT user with given userId and given input
    updateUserById: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get userId paramater from URL
            const paramUserId = req.params.userId;
            // Check if userId isnt a number
            if (isNaN(paramUserId)) {
                return next();
            }
            // Get userId paramater from URL
            const userId = req.userId;
            // Get the user with the given userId
            connection.query('SELECT * FROM user WHERE id = ?', paramUserId, function (err, results, fields) {
                if (err) throw err;
                // If an user is found get into the if statement
                if(results.length > 0) {
                    // Check if id's aren't equal
                    if(paramUserId != userId) {
                        // Return status + message to error handler
                        return next({
                            status: 403,
                            message: 'Not the owner of this account!'
                        });
                    }
                    // Get request and assign it as an user
                    const updatedUser = {
                        ...results[0],
                        ...req.body
                    }
                    // Check if emailAdress already exists
                    connection.query('SELECT COUNT(emailAdress) as count FROM user WHERE emailAdress = ? AND id <> ?', [updatedUser.emailAdress, paramUserId], function (err, results, fields) {
                        if (err) throw err;
                        // If emailaddress is unique get into the if statement
                        if(results[0].count === 0) {
                            // Update the user
                            connection.query('UPDATE user SET firstName = ?, lastName = ?, emailAdress = ?, password = ?, phoneNumber = ?, street = ?, city = ? WHERE id = ?',
                                    [updatedUser.firstName, updatedUser.lastName, updatedUser.emailAdress, updatedUser.password, updatedUser.phoneNumber, updatedUser.street, updatedUser.city, paramUserId], 
                                    function (err, results, fields) {
                                connection.release();
        
                                if (err) throw err;
        
                                if(res.statusCode >= 200 && res.statusCode <= 299) {
                                    // Return JSON with response
                                    res.status(200).json({
                                        status: 200,
                                        message: 'User has been updated!',
                                        result: formatUser([updatedUser])
                                    });
                                    res.end();
                                } else {
                                    // Return status + message to error handler
                                    return next({
                                        status: 401,
                                        message: 'Forbidden'
                                    });
                                }
                            });
                        } else {
                            // Return status + message to error handler
                            return next({
                                status: 409,
                                message: 'User already exist!'
                            });
                        }
                    });
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 400,
                        message: 'User does not exist'
                    });
                }
            });
        });
    },
    // DELETE user with given userId
    deleteUserById: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get userId paramater from URL
            const paramUserId = req.params.userId;
            // Check if userId isnt a number
            if (isNaN(paramUserId)) {
                return next();
            }
            // Get userId paramater from URL
            const userId = req.userId;
            // Get the user with the given userId
            connection.query('SELECT * FROM user WHERE id = ?', paramUserId, function (err, results, fields) {
                if (err) throw err;
                // If an user is found get into the if statement
                if(results.length > 0) {
                     // Check if id's aren't equal
                    if(paramUserId != userId) {
                        // Return status + message to error handler
                        return next({
                            status: 403,
                            message: 'Not the owner of this account!'
                        });
                    }
                    // Delete the user
                    connection.query('DELETE FROM user WHERE id = ?', paramUserId, function (err, results, fields) {
                        connection.release();
                    
                        if (err) throw err;
        
                        if(res.statusCode >= 200 && res.statusCode <= 299) {
                            // Return JSON with response
                            res.status(200).json({
                                status: 200,
                                message: 'User has been deleted!'
                            });
                            res.end();
                        } else {
                            // Return status + message to error handler
                            return next({
                                status: 401,
                                message: 'Forbidden'
                            });
                        }
                    });
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 400,
                        message: 'User does not exist'
                    });
                }
            });
        });
    }
};

const formatUser = (results) => {
    // Take each result
    results.forEach(result => {
        // Get the values that we want to modify
        let boolObj = {
            isActive: result.isActive
        }
        // Get all the keys from the object
        let keys = Object.keys(boolObj);
        // Check for each key if value is 1 or 0 and modify it to true or false
        keys.forEach(key => {
            if(boolObj[key] === 1) {
                boolObj[key] = true;
            } else {
                boolObj[key] = false;
            }
        });
        // Assign the modified values to the results object
        result.isActive = boolObj.isActive;
    });
    // If length is 1 than return 1 result
    if(results.length === 1) {
        return results[0];
    }
    // Return the modified results
    return results;
}

// Export the userController
module.exports = userController;