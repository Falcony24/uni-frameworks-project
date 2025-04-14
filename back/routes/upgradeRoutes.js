const express = require('express')
const { getUpgrades, replaceUpgrade, updateUpgrade, deleteUpgrade, createUpgrade, buyUpgrade
} = require('../controllers/upgradeController')
const {auth} = require("../middlewares/auth");

const router = express.Router()

// /upgrades
router.get('/', getUpgrades);
router.post('/', auth, createUpgrade);
router.put('/:id', auth, replaceUpgrade);

router.patch('/:id', auth, updateUpgrade);
router.patch('/buy/:upgradeId', auth, buyUpgrade);

router.delete('/:id', auth, deleteUpgrade);

module.exports = router;
