const express = require('express')
const router = express.Router()
const multipart = require('connect-multiparty')
const MainProductController = require('../controllers/mainProduct')
const md_upload_image = multipart({ uploadDir: './uploads/image'})
const md_auth = require('../middlewares/authenticated')

router.route('/main-product')
    .post([md_auth.ensureAuth], MainProductController.add)

router.route('/main-product/:id')
    .put([md_auth.ensureAuth], MainProductController.update)
    .delete([md_auth.ensureAuth], MainProductController.remove)

router.route('/main-products')
    .get(MainProductController.show)


router.route('/main-product-image/:id')
    .put([md_auth.ensureAuth, md_upload_image], MainProductController.addImage)

router.route('/main-product-image/:imageName')
    .get(MainProductController.showImage)

module.exports = router