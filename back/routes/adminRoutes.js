const express = require('express')
const { profile, getProfileData, changeUserData, deleteData, deleteProfile, getAllUsers
} = require('../controllers/userController')
const { auth } = require("../middlewares/auth")

const router = express.Router()

// /admins

router.get("/", auth, getAllUsers)
router.get('/:id', auth, profile)                   //ok
router.get('/data/:type/:id', auth, getProfileData) //ok

router.put('/:type:id', auth, )

router.patch('/:type/:id', auth, changeUserData) //ok

router.delete('/:id', auth, deleteProfile)      //ok
router.delete('/:type/:id', auth, deleteData)   //


module.exports = router