const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.post('/createUser', userController.createUser);
router.post('/login', userController.login);
router.post('/createAdmin', userController.createAdmin);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUsersByRole/:role', userController.getUsersByRole);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;