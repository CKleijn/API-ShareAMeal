// Default settings
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentication.controller');

// All /login routes
router.route('/api/login')
    // Login + validation
    .post(authController.validateLogin, authController.loginAsUser);

// Export the authenticationRouter
module.exports = router;