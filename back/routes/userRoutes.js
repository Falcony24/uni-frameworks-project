const express = require('express')
const { profile, getProfileData, changeUserData, deleteData, deleteProfile, putData
} = require('../controllers/userController')
const { auth } = require("../middlewares/auth")

const router = express.Router()

// /users

// logged user
router.get('/', auth, profile)                  //ok
router.get('/data/:type', auth, getProfileData) //ok

router.put('/:type', auth, putData)

router.patch('/:type', auth, changeUserData)    //ok

router.delete('/', auth, deleteProfile)         //ok


module.exports = router
