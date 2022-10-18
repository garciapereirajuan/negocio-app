const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')
const md_auth = require('../middlewares/authenticated')

router.route('/user/login')
    .post(UserController.login)

router.route('/user/:id')
    .put([md_auth.ensureAuth], UserController.update)
    .delete([md_auth.ensureAuth], UserController.remove)

router.route('/user')
    .post(UserController.add)

router.route('/users')
    .get([md_auth.ensureAuth], UserController.show)

module.exports = router