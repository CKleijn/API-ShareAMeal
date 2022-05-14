// Default settings
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/authentication.controller');

// All /user routes
router.route('/api/user')
    // Get all users
    .get(authController.validateToken, userController.getAllUsers)
    // Create an user + create validation
    .post(userController.validateCreateUser, userController.addUser);

// Get user profile
router.get('/api/user/profile', authController.validateToken, userController.getUserProfile);

// All /user/:userId routes
router.route('/api/user/:userId')
    // Get specific user on userId
    .get(authController.validateToken, userController.getUserById)
    // Update specific user on userId + update validation
    .put(authController.validateToken, userController.validateUpdateUser, userController.updateUserById)
    // Delete specific user on userId
    .delete(authController.validateToken, userController.deleteUserById);

// Export the userRouter
module.exports = router;