const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth')

router.post('/refresh-access-token', AuthController.refreshAccessToken)

module.exports = router