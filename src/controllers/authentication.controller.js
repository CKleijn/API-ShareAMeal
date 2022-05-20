// Default settings
const assert = require('assert')
const jwt = require('jsonwebtoken')
const dbconnection = require('../../database/dbconnection')
const jwtSecretKey = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');

// Create an AuthController
const authController = {
    validateLogin(req, res, next) {
        // Validation regex
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        // Get request and assign it as an user
        const user = req.body;
        const { emailAdress, password } = user;
        try {
            // Put assert on each key to create the validation
            assert(typeof emailAdress === 'string', 'emailAdress must be a string!');
            assert(emailAdress.match(emailRegex), 'emailAdress is not valid!');
            assert(typeof password === 'string', 'password must be a string!');
            assert(password.match(passwordRegex), 'password is not valid!');
            next();
        } catch (err) {
            // Return status + message to error handler
            return next({
                status: 400,
                message: err.message
            });
        }
    },
    loginAsUser(req, res, next) {
        dbconnection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query('SELECT id, emailAdress, password, firstName, lastName FROM user WHERE emailAdress = ?', [req.body.emailAdress], (err, rows, fields) => {
                connection.release()
                
                if (err) throw err;

                if (rows) {
                    if(rows && rows.length === 1 && bcrypt.compareSync(req.body.password, rows[0].password)) {
                        
                        const { password, ...userInfo } = rows[0]

                        const payload = {
                            userId: userInfo.id
                        }

                        jwt.sign(payload, jwtSecretKey, { expiresIn: '20d' }, function (err, token) {
                            res.status(200).json({
                                status: 200,
                                result: { ...userInfo, token }
                            });
                        });

                    } else {
                        res.status(404).json({
                            status: 404,
                            message: 'User not found or password invalid'
                        });
                    }
                }
            });
        });
    },
    validateToken(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                status: 401,
                message: 'Not logged in!'
            });
        } else {
            const token = authHeader.substring(7, authHeader.length)

            jwt.verify(token, jwtSecretKey, (err, payload) => {
                if (err) {
                    res.status(401).json({
                        status: 401,
                        message: 'Invalid token!'
                    });
                }
                if (payload) {
                    req.userId = payload.userId;
                    next();
                }
            });
        }
    }
}
// Export the authController
module.exports = authController;