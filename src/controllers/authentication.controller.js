// Default settings
const assert = require('assert')
const jwt = require('jsonwebtoken')
const dbconnection = require('../../database/dbconnection')
const jwtSecretKey = process.env.JWT_SECRET;

// Create an AuthController
const authController = {
    validateLogin(req, res, next) {
        try {
            assert(typeof req.body.emailAdress === 'string', 'emailAdress must be a string!');
            assert(typeof req.body.password === 'string', 'password must be a string!');
            next();
        } catch (ex) {
            res.status(422).json({
                error: ex.toString(),
                datetime: new Date().toISOString()
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
                    if(rows && rows.length === 1 && rows[0].password == req.body.password) {
                        const { password, ...userInfo } = rows[0]

                        const payload = {
                            userId: userInfo.id
                        }

                        jwt.sign(payload, jwtSecretKey, { expiresIn: '20d' }, function (err, token) {
                            res.status(200).json({
                                statusCode: 200,
                                results: { ...userInfo, token }
                            });
                        });

                    } else {
                        res.status(401).json({
                            message: 'User not found or password invalid',
                            datetime: new Date().toISOString()
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
                error: 'Authorization header missing!',
                datetime: new Date().toISOString()
            });
        } else {
            const token = authHeader.substring(7, authHeader.length)

            jwt.verify(token, jwtSecretKey, (err, payload) => {
                if (err) {
                    res.status(401).json({
                        error: 'Not authorized',
                        datetime: new Date().toISOString()
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