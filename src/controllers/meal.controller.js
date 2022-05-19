// Default settings
const assert = require('assert');
const { json } = require('express/lib/response');
const dbconnection = require('../../database/dbconnection');

// Create an MealController
const mealController = {
    // Create validation
    validateMeal: (req, res, next) => {
        // Get request and assign it as an user
        const meal = req.body;
        const { name, description, isActive, isVega, isVegan, isToTakeHome, dateTime, imageUrl, maxAmountOfParticipants, price, allergenes } = meal;
        try {
            // Put assert on each key to create the validation
            assert(typeof name === 'string', 'name must be a string!');
            assert(typeof description === 'string', 'description must be a string!');
            assert(typeof isActive === 'boolean' || typeof isActive === 'number', 'IsActive must be a boolean or number between 0 and 1!');
            assert(typeof isVega === 'boolean' || typeof isVega === 'number', 'IsVega must be a boolean or number between 0 and 1!');
            assert(typeof isVegan === 'boolean' || typeof isVegan === 'number', 'IsVegan must be a boolean or number between 0 and 1!');
            assert(typeof isToTakeHome === 'boolean' || typeof isToTakeHome === 'number', 'IsToTakeHome must be a boolean or number between 0 and 1!');
            assert(typeof dateTime === 'string', 'dateTime must be a string!');
            assert(typeof imageUrl === 'string', 'imageUrl must be a string!');
            assert(typeof maxAmountOfParticipants === 'number', 'maxAmountOfParticipants must be a number!');
            assert(typeof price === 'number', 'price must be a number!');
            // assert(typeof allergenes === 'array', 'allergenes must be an array!');
            next();
        } catch (err) {
            // Return status + message to error handler
            return next({
                status: 400,
                message: err.message
            });
        }
    },
    // GET all meals with query
    getAllMeals: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get all meals 
            connection.query('SELECT * FROM meal', function (err, resultsMeal, fields) {
                if (err) throw err;
                // Check if there are any meals
                if(resultsMeal.length > 0) {
                    // Create array to store all meals + cook + participants
                    let fullMeals = [];
                    // Get each meal
                    resultsMeal.forEach(meal => {
                        // Store single meal in let
                        let fullMeal = meal;
                        // Get cook with cookId
                        connection.query('SELECT * FROM user WHERE id = ?', meal.cookId, function (err, resultsCook, fields) {
                            if (err) throw err;
                            // Check if there are any cooks
                            if(resultsCook.length > 0) {
                                // Delete cookId
                                delete meal.cookId
                                // Assign meal + cook to fullMeal
                                fullMeal = {
                                    ...formatMeal(fullMeal),
                                    'cook': formatUser(resultsCook[0])
                                }
                            } else {
                                // Return status + message to error handler
                                return next({
                                    status: 404,
                                    message: 'User does not exist with the id of ' + meal.cookId
                                });
                            }
                        });
                        // Get all participants from meal
                        connection.query('SELECT userId FROM meal_participants_user WHERE mealId = ?', meal.id, function (err, resultsParticipants, fields) {
                            if (err) throw err;
                            // Create array to store all participants
                            let participants = [];
                            // Check if there are participants
                            if(resultsParticipants.length > 0) {
                                // Get each participant
                                resultsParticipants.forEach(participant => {
                                    // Get participant with userId
                                    connection.query('SELECT * FROM user WHERE id = ?', participant.userId, function (err, resultsParticipant, fields) {
                                        // Push participant to participants array 
                                        participants.push(formatUser(resultsParticipant[0]));
                                        // Call the callback
                                        callback();
                                    });
                                });
                            } else {
                                // Call the callback
                                callback();
                            }
                            // Create the callback
                            function callback() {
                                // Check if participants array equals participants length
                                if(resultsParticipants.length === participants.length) {
                                    // Assign meal + participants to fullMeal
                                    fullMeal = {
                                        ...fullMeal,
                                        'participants': participants
                                    }
                                    // Push new meal + participants
                                    fullMeals.push(fullMeal)
                                    // Check if array lengths are equal
                                    if(resultsMeal.length === fullMeals.length) {
                                        // Release connection
                                        connection.release();
                                        // Return JSON with response
                                        res.status(200).json({
                                            status: 200,
                                            result: fullMeals
                                        });
                                        res.end();
                                    }
                                }
                            }
                        });
                    });
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 404,
                        message: 'No meals found'
                    });
                }
            });
        });
    },
    addMeal: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get request and assign it as a meal
            const meal = {
                    ...req.body
                }
            // From array to string
            meal.allergenes = meal.allergenes.join();
            // Create the meal    
            connection.query("INSERT INTO meal (name, description, isActive, isVega, isVegan, isToTakeHome, dateTime, imageUrl, maxAmountOfParticipants, price, allergenes, cookId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                            [meal.name, meal.description, meal.isActive, meal.isVega, meal.isVegan, meal.isToTakeHome, meal.dateTime, meal.imageUrl, meal.maxAmountOfParticipants, meal.price, meal.allergenes, req.userId], 
                            (err, results, fields) => {

                if (err) throw err;
                // Get mealId
                const mealId = results.insertId;
                // Get meal with given mealId
                connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, resultsMeal, fields) { 
                    if (err) throw err;
                    // Check if there are any meals
                    if(resultsMeal.length > 0) {
                        // Store single meal in let
                        let fullMeal = resultsMeal[0];
                        // Get cook with cookId
                        connection.query('SELECT * FROM user WHERE id = ?', fullMeal.cookId, function (err, resultsCook, fields) {
                            if (err) throw err;
                            // Check if there are any cooks
                            if(resultsCook.length > 0) {
                                // Delete cookId
                                delete fullMeal.cookId
                                // Assign meal + cook to fullMeal
                                fullMeal = {
                                    ...formatMeal(fullMeal),
                                    'cook': formatUser(resultsCook[0])
                                }
                            } else {
                                // Return status + message to error handler
                                return next({
                                    status: 404,
                                    message: 'User does not exist with the id of ' + fullMeal.cookId
                                });
                            }
                        });
                        // Get all participants from meal
                        connection.query('SELECT userId FROM meal_participants_user WHERE mealId = ?', mealId, function (err, resultsParticipants, fields) {
                            if (err) throw err;
                            // Create array to store all participants
                            let participants = [];
                            // Check if there are participants
                            if(resultsParticipants.length > 0) {
                                // Get each participant
                                resultsParticipants.forEach(participant => {
                                    // Get participant with userId
                                    connection.query('SELECT * FROM user WHERE id = ?', participant.userId, function (err, resultsParticipant, fields) {
                                        // Push participant to participants array 
                                        participants.push(formatUser(resultsParticipant[0]));
                                        // Call the callback
                                        callback();
                                    });
                                });
                            } else {
                                // Call the callback
                                callback();
                            }
                            // Create the callback
                            function callback() {
                                // Check if participants array equals participants length
                                if(resultsParticipants.length === participants.length) {
                                    // Assign meal + participants to fullMeal
                                    fullMeal = {
                                        ...fullMeal,
                                        'participants': participants
                                    }
                                    // Release connection
                                    connection.release();
                                    // Return JSON with response
                                    res.status(201).json({
                                        status: 201,
                                        message: 'Meal has been created!',
                                        result: fullMeal
                                    });
                                    res.end();
                                }
                            }
                        });
                    } else {
                        // Return status + message to error handler
                        return next({
                            status: 404,
                            message: 'Meal does not exist with the id of ' + mealId
                        });
                    }
                });
            });
        });
    },
    getMealById: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get mealId paramater from URL
            const mealId = req.params.mealId;
            // Check if mealId isnt a number
            if (isNaN(mealId)) {
                return next();
            }
            // Get meal with given mealId
            connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, resultsMeal, fields) { 
                if (err) throw err;
                // Check if there are any meals
                if(resultsMeal.length > 0) {
                    // Store single meal in let
                    let fullMeal = resultsMeal[0];
                    // Get cook with cookId
                    connection.query('SELECT * FROM user WHERE id = ?', fullMeal.cookId, function (err, resultsCook, fields) {
                        if (err) throw err;
                        // Check if there are any cooks
                        if(resultsCook.length > 0) {
                            // Delete cookId
                            delete fullMeal.cookId
                            // Assign meal + cook to fullMeal
                            fullMeal = {
                                ...formatMeal(fullMeal),
                                'cook': formatUser(resultsCook[0])
                            }
                        } else {
                            // Return status + message to error handler
                            return next({
                                status: 404,
                                message: 'User does not exist with the id of ' + fullMeal.cookId
                            });
                        }
                    });
                    // Get all participants from meal
                    connection.query('SELECT userId FROM meal_participants_user WHERE mealId = ?', mealId, function (err, resultsParticipants, fields) {
                        if (err) throw err;
                        // Create array to store all participants
                        let participants = [];
                        // Check if there are participants
                        if(resultsParticipants.length > 0) {
                            // Get each participant
                            resultsParticipants.forEach(participant => {
                                // Get participant with userId
                                connection.query('SELECT * FROM user WHERE id = ?', participant.userId, function (err, resultsParticipant, fields) {
                                    // Push participant to participants array 
                                    participants.push(formatUser(resultsParticipant[0]));
                                    // Call the callback
                                    callback();
                                });
                            });
                        } else {
                            // Call the callback
                            callback();
                        }
                        // Create the callback
                        function callback() {
                            // Check if participants array equals participants length
                            if(resultsParticipants.length === participants.length) {
                                // Assign meal + participants to fullMeal
                                fullMeal = {
                                    ...fullMeal,
                                    'participants': participants
                                }
                                // Release connection
                                connection.release();
                                // Return JSON with response
                                res.status(200).json({
                                    status: 200,
                                    result: fullMeal
                                });
                                res.end();
                            }
                        }
                    });
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 404,
                        message: 'Meal does not exist with the id of ' + mealId
                    });
                }
            });
        });
    },
    updateMealById: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get mealId paramater from URL
            const mealId = req.params.mealId;
            // Check if mealId isnt a number
            if (isNaN(mealId)) {
                return next();
            }
            // Get cookId from token
            const cookId = req.userId;        
            // Get the meal with the given mealId
            connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, resultsMeal, fields) {
                if (err) throw err;
                // If a meal is found get into the if statement
                if(resultsMeal.length > 0) {
                    // Check if id's aren't equal
                    if(cookId !== resultsMeal[0].cookId) {
                        // Return status + message to error handler
                        return next({
                            status: 403,
                            message: 'Not the owner of the data!'
                        });
                    }
                    // Get request and assign it as a meal
                    const updatedMeal = {
                            ...resultsMeal[0],
                            ...req.body
                        }
                    // From array to string
                    updatedMeal.allergenes = updatedMeal.allergenes.join();
                    // Update the meal
                    connection.query('UPDATE meal SET name = ?, description = ?, isActive = ?, isVega = ?, isVegan = ?, isToTakeHome = ?, dateTime = ?, imageUrl = ?, allergenes = ?, maxAmountOfParticipants = ?, price = ? WHERE id = ?',
                    [updatedMeal.name, updatedMeal.description, updatedMeal.isActive, updatedMeal.isVega, updatedMeal.isVegan, updatedMeal.isToTakeHome, updatedMeal.dateTime, updatedMeal.imageUrl, updatedMeal.allergenes, updatedMeal.maxAmountOfParticipants, updatedMeal.price, mealId],
                            function (err, results, fields) {

                        if (err) throw err;
                        // Store single meal in let
                        let fullMeal = updatedMeal;
                        // Get cook with cookId
                        connection.query('SELECT * FROM user WHERE id = ?', fullMeal.cookId, function (err, resultsCook, fields) {
                            if (err) throw err;
                            // Check if there are any cooks
                            if(resultsCook.length > 0) {
                                // Delete cookId
                                delete fullMeal.cookId
                                // Assign meal + cook to fullMeal
                                fullMeal = {
                                    ...formatMeal(fullMeal),
                                    'cook': formatUser(resultsCook[0])
                                }
                            } else {
                                // Return status + message to error handler
                                return next({
                                    status: 404,
                                    message: 'User does not exist with the id of ' + fullMeal.cookId
                                });
                            }
                        });
                        // Get all participants from meal
                        connection.query('SELECT userId FROM meal_participants_user WHERE mealId = ?', mealId, function (err, resultsParticipants, fields) {
                            if (err) throw err;
                            // Create array to store all participants
                            let participants = [];
                            // Check if there are participants
                            if(resultsParticipants.length > 0) {
                                // Get each participant
                                resultsParticipants.forEach(participant => {
                                    // Get participant with userId
                                    connection.query('SELECT * FROM user WHERE id = ?', participant.userId, function (err, resultsParticipant, fields) {
                                        // Push participant to participants array 
                                        participants.push(formatUser(resultsParticipant[0]));
                                        // Call the callback
                                        callback();
                                    });
                                });
                            } else {
                                // Call the callback
                                callback();
                            }
                            // Create the callback
                            function callback() {
                                // Check if participants array equals participants length
                                if(resultsParticipants.length === participants.length) {
                                    // Assign meal + participants to fullMeal
                                    fullMeal = {
                                        ...fullMeal,
                                        'participants': participants
                                    }
                                    // Release connection
                                    connection.release();
                                    // Return JSON with response
                                    res.status(200).json({
                                        status: 200,
                                        message: 'Meal has been updated!',
                                        result: fullMeal
                                    });
                                    res.end();
                                }
                            }
                        });
                    });
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 404,
                        message: 'Meal does not exist with the id of ' + mealId
                    });
                }
            });
        });
    },
    // DELETE meal with given mealId
    deleteMealById: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get mealId paramater from URL
            const mealId = req.params.mealId;
            // Check if mealId isnt a number
            if (isNaN(mealId)) {
                return next();
            }
            // Get cookId from token
            const cookId = req.userId;
            // Get the meal with the given mealId
            connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, results, fields) {
                if (err) throw err;
                // If a meal is found get into the if statement
                if(results.length > 0) {
                    // Check if id's aren't equal
                    if(cookId !== results[0].cookId) {
                        // Return status + message to error handler
                        return next({
                            status: 403,
                            message: 'Not the owner of the data!'
                        });
                    }
                    // Delete the meal
                    connection.query('DELETE FROM meal WHERE id = ?', mealId, function (err, results, fields) {
                        connection.release();
                    
                        if (err) throw err;
        
                        // Return JSON with response
                        res.status(200).json({
                            status: 200,
                            message: 'Meal has been removed!'
                        });
                        res.end();
                    });
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 404,
                        message: 'Meal does not exist with the id of ' + mealId
                    });
                }
            });
        });
    }
};

const formatMeal = (result) => {
    // Get the values that we want to modify
    let boolObj = {
        isActive: result.isActive,
        isVega: result.isVega,
        isVegan: result.isVegan,
        isToTakeHome: result.isToTakeHome
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
    result.isVega = boolObj.isVega;
    result.isVegan = boolObj.isVegan;
    result.isToTakeHome = boolObj.isToTakeHome;
    // From string to array
    result.allergenes = result.allergenes.split(',');
    // Check if allergenes is empty
    if (result.allergenes.length === 0) {
        result.allergenes = [];
    }
    // Return the modified results
    return result;
}

const formatUser = (result) => {
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
    // Return the modified results
    return result;
}

// Export the mealController
module.exports = mealController;