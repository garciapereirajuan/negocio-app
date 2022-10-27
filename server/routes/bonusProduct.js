const express = require('express')
const router = express.Router()
const md_auth = require('../middlewares/authenticated')
const BonusProductController = require('../controllers/bonusProduct')

router.route('/bonus-product')
	.post([md_auth.ensureAuth], BonusProductController.add)

router.route('/bonus-products')
	.get(BonusProductController.show)

module.exports = router