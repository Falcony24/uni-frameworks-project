const express = require('express')
const {logoutUser, signIn, signUp, tokenVerify} = require('../controllers/authController')

const router = express.Router()

router.get('/', tokenVerify)

router.post('/logout', logoutUser)
router.post('/signup', signUp)
router.post('/signin', signIn)

module.exports = router