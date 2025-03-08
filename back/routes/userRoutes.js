const express = require('express');
const { registerUser, loginUser, profileUser, changeCredentials, deleteUser, logoutUser } = require('../controllers/userController');


const router = express.Router();

router.get('/profile', profileUser);
router.get('/logout', logoutUser)

router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/change', changeCredentials);

router.delete('/delete', deleteUser)

module.exports = router;
