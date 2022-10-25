const express = require('express')
const router = express.Router()
const md_auth = require('../middlewares/authenticated')
const CategoryController = require('../controllers/category')

router.route('/category/:id')
    .put([md_auth.ensureAuth], CategoryController.update)
    .delete([md_auth.ensureAuth], CategoryController.remove)

router.route('/category-order/:id')
    .put([md_auth.ensureAuth], CategoryController.updateOrder)

router.route('/category')
    .post([md_auth.ensureAuth], CategoryController.add)

router.route('/categories') 
    .get(CategoryController.show)

module.exports = router