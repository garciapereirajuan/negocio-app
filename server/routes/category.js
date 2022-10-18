const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/category')

router.route('/category/:id')
    .put(CategoryController.update)
    .delete(CategoryController.remove)

router.route('/category')
    .post(CategoryController.add)

module.exports = router