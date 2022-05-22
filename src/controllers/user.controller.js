// Default settings
const assert = require('assert');
const dbconnection = require('../../database/dbconnection');
const bcrypt = require('bcrypt');

// Create an UserController
const userController = {
    // Create validation for POST
    validateCreateUser: (req, res, next) => {
        // Validation regex
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        const phoneNumberRegex =  /^06[0-9]{8}$/;
        // Get request and assign it as an user
        const user = req.body;
        const { firstName, lastName, emailAdress, password, street, city, phoneNumber } = user;
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
            assert(typeof phoneNumber === 'string', 'phoneNumber must be a string!');
            assert(phoneNumber.match(phoneNumberRegex), 'phoneNumber is not valid!');
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
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        const phoneNumberRegex =  /^06[0-9]{8}$/;
        // Get request and assign it as an user
        const user = req.body;
        const { firstName, lastName, emailAdress, password, street, city, phoneNumber } = user;
        try {
            // Put assert on each key to create the validation
            assert(typeof emailAdress === 'string', 'emailAdress must be a string!');
            assert(emailAdress.match(emailRegex), 'emailAdress is not valid!');

            if(firstName) {
                assert(typeof firstName === 'string', 'firstName must be a string!');
            }

            if(lastName) {
                assert(typeof lastName === 'string', 'lastName must be a string!');
            }

            if(password) {
                assert(typeof password === 'string', 'password must be a string!');
                assert(password.match(passwordRegex), 'password is not valid!');
            }

            if(street) {
                assert(typeof street === 'string', 'street must be a string!');
            }

            if(city) {
                assert(typeof city === 'string', 'city must be a string!');
            }

            if(phoneNumber) {
                assert(typeof phoneNumber === 'string', 'phoneNumber must be a string!');
                assert(phoneNumber.match(phoneNumberRegex), 'phoneNumber is not valid!');
            }
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
        const { isActive, firstName, limit, lastName, emailAdress, street, city, phoneNumber } = req.query;
        // Base query
        let queryString = 'SELECT * FROM user';
        // Check if there is a firstName or isActive paramater
        if(isActive || firstName || limit || lastName || emailAdress || street || city || phoneNumber) {
            // Create count (MAX 2)
            let count = 0;
            // Add WHERE to query if it's one of those values
            if (isActive || firstName || lastName || emailAdress || street || city || phoneNumber) {
                queryString += ' WHERE ';
            }
            // Check if there is an isActive paramater - if yes then add to query
            if(isActive) {
                if (count === 1) {
                    queryString += ' AND ';
                }
                queryString += `isActive = ` + isActive;
                count++;
            }
            // Check if there is a firstName paramater - if yes then add to query
            if(firstName) {
                if (count === 1) {
                    queryString += ' AND ';
                }
                count++;
                queryString += `firstName = '` + firstName + `'`;
            }
            // Check if there is a lastName paramater - if yes then add to query
            if(lastName) {
                if (count === 1) {
                    queryString += ' AND ';
                }
                count++;
                queryString += `lastName = '` + lastName + `'`;
            }
            // Check if there is an emailAdress paramater - if yes then add to query
            if(emailAdress) {
                if (count === 1) {
                    queryString += ' AND ';
                }
                count++;
                queryString += `emailAdress = '` + emailAdress + `'`;
            }
            // Check if there is a street paramater - if yes then add to query
            if(street) {
                if (count === 1) {
                    queryString += ' AND ';
                }
                count++;
                queryString += `street = '` + street + `'`;
            }
            // Check if there is a city paramater - if yes then add to query
            if(city) {
                if (count === 1) {
                    queryString += ' AND ';
                }
                count++;
                queryString += `city = '` + city + `'`;
            }
            // Check if there is a phoneNumber paramater - if yes then add to query
            if(phoneNumber) {
                if (count === 1) {
                    queryString += ' AND ';
                }
                count++;
                queryString += `phoneNumber = '` + phoneNumber + `'`;
            }
            // Check if there is a limit paramater - if yes then add to query
            if (limit) {
                queryString += ' LIMIT ' + limit;
            }
            // Check if count is above 2 - if yes show error message
            if (count > 2) {
                return next({
                    status: 400,
                    message: 'Maximum amount of parameters has been reached!',
                });
            }
        }
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get users with given filter
            connection.query(queryString, function (err, results, fields) {
                connection.release();
            
                if (err) throw err;

                // Return JSON with response
                res.status(200).json({
                    status: 200,
                    result: formatUser(results)
                });
                res.end();
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
                    // Hash password
                    const hashedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
                    // Create new user
                    connection.query('INSERT INTO user (firstName, lastName, emailAdress, password, street, city, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                                [user.firstName, user.lastName, user.emailAdress, hashedPassword, user.street, user.city, user.phoneNumber], function (err, results, fields) {

                        if (err) throw err;

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
                    // Return JSON with response
                    res.status(200).json({
                        status: 200,
                        result: formatUser(results)
                    });
                    res.end();
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
                    // Return JSON with response
                    res.status(200).json({
                        status: 200,
                        result: formatUser(results)
                    });
                    res.end();
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
                            // Hash password if it's in the req
                            if(req.body.password) {
                                updatedUser.password = bcrypt.hashSync(updatedUser.password, bcrypt.genSaltSync());
                            }
                            // Update the user
                            connection.query('UPDATE user SET firstName = ?, lastName = ?, emailAdress = ?, password = ?, phoneNumber = ?, street = ?, city = ?, phoneNumber = ? WHERE id = ?',
                                    [updatedUser.firstName, updatedUser.lastName, updatedUser.emailAdress, updatedUser.password, updatedUser.phoneNumber, updatedUser.street, updatedUser.city, updatedUser.phoneNumber, paramUserId], 
                                    function (err, results, fields) {
                                connection.release();
        
                                if (err) throw err;
        
                                // Return JSON with response
                                res.status(200).json({
                                    status: 200,
                                    message: 'User has been updated!',
                                    result: formatUser([updatedUser])
                                });
                                res.end();
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
                    // Get all meals where user is cook
                    connection.query('SELECT * FROM meal WHERE cookId = ?', paramUserId, function (err, results, fields) {
                        if (err) throw err;
                        // Check if there are any results
                        if(results.length > 0) {
                            results.forEach(result => {
                                // Delete all meals where user is cook
                                connection.query('DELETE FROM meal WHERE cookId = ?', result.cookId, function (err, results, fields) {
                                    if (err) throw err;
                                });
                                // Delete all meals where user is participating in
                                connection.query('DELETE FROM meal_participants_user WHERE userId = ?', result.cookId, function (err, results, fields) {
                                    if (err) throw err;
                                });
                            });
                        }
                    });
                    // Delete the user
                    connection.query('DELETE FROM user WHERE id = ?', paramUserId, function (err, results, fields) {
                        connection.release();
                    
                        if (err) throw err;
        
                        // Return JSON with response
                        res.status(200).json({
                            status: 200,
                            message: 'User has been deleted!'
                        });
                        res.end();
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
    // If results are empty return it
    if(results.length === 0) {
        return [];
    }
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