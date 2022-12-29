const express = require('express')
const router = express.Router()
const multipart = require('connect-multiparty')
const MainProductController = require('../controllers/mainProduct')
const md_auth = require('../middlewares/authenticated')

// USAR ESTA LINEA CUANDO LAS IMAGENES SE GUARDEN EN EL SERVER
// const md_upload_image = multipart({ uploadDir: './uploads/image'})

// USAR ESTA LINEA CUANDO LAS IMAGENES SE SUBAN AL BUCKET CON AWS-SDK
const md_upload_image = multipart({})


router.route('/main-product')
    .post([md_auth.ensureAuth], MainProductController.add)

router.route('/main-product/:id')
    .put([md_auth.ensureAuth], MainProductController.update)
    .delete([md_auth.ensureAuth], MainProductController.remove)

router.route('/main-product-checkbox-and-order/:id')
    .put([md_auth.ensureAuth], MainProductController.updateForCheckboxAndOrder)

router.route('/main-products')
    .post(MainProductController.show)

router.get('/main-product-images-all', MainProductController.getAllImages)

router.route('/main-product-image/:id')
    .put([md_auth.ensureAuth, md_upload_image], MainProductController.addImage)

router.route('/main-product-image/:imageName')
    .get(MainProductController.showImage)

module.exports = router