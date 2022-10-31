const express = require('express')
const router = express.Router()
const md_auth = require('../middlewares/authenticated')
const BonusProductController = require('../controllers/bonusProduct')

router.route('/bonus-product/:id')
	.put([md_auth.ensureAuth], BonusProductController.update)
	.delete([md_auth.ensureAuth], BonusProductController.remove)

router.route('/bonus-product-checkbox-and-order/:id')
	.put([md_auth.ensureAuth], BonusProductController.updateForCheckboxAndOrder)

router.route('/bonus-product')
	.post([md_auth.ensureAuth], BonusProductController.add)

router.route('/bonus-products')
	.get(BonusProductController.show)

module.exports = router