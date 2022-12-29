const MainProduct = require('../models/mainProduct') 
const Category = require('../models/category')
const message = require('../utils/message')
const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')

//Acá es donde aplico lo comentado en config.js
//por el tema de la autenticación y variables de
//entorno para la autenticación de aws-sdk

const { 
    ACCESS_KEY_ID_AWS, 
    SECRET_ACCESS_KEY_AWS, 
    BUCKET_NAME_AWS, 
    REGION_AWS 
} = require('../config')

exports.add = (req, res) => {
    const data = req.body

    if (!data.title || !data.description) {
        message(res, 404, 'El título y la descripción del producto son obligatorios.')
        return
    }

    const mainProduct = new MainProduct(data)

    mainProduct.save()
        .then(mainProduct => {
            if (!mainProduct) {
                message(res, 404, 'Ocurrió un error en el servidor, intenta más tarde.')
                return
            }

            message(res, 200, 'Producto agregado correctamente.', { mainProductId: mainProduct._id })
        })
        .catch(err => {
            if (err?.code === 11000) {
              message(res, 404, 'Ya existe un producto con este nombre, intenta otro.', { err })
                return
            }

            message(res, 404, 'Ocurrió un error en el servidor, intenta más tarde.')
        })
}

exports.addImage = (req, res) => {
    const { id } = req.params
    let image = ''

    if (!req.files || !id) {
        message(res, 404, 'La imagen y el Id del producto son obligatorios.')
        return
    }

    const updateImageInMainProduct = (image) => {
        MainProduct.findByIdAndUpdate(id, { image }, (err, mainProduct) => {
            if (err?.path === '_id') {
                message(res, 404, 'No se encontró el producto al cual quieres asociarle la imagen.')
                return
            }
            if (err) {
                message(res, 500, 'Ocurrió un error en el servidor.', { err })
                return
            }
            if (!mainProduct) {
                message(res, 404, 'No se encontró el producto.')
                return
            }
            if (mainProduct) {
                message(res, 200, 'Imagen del producto subida correctamente.')
            }
        })
    }

    // --- para subir la imagen al bucket con aws-sdk   
    const uploadImageInBucket = () => {
        AWS.config.update({ region: REGION_AWS })

        const options = {
            apiVersion: '2006-03-01',
            accessKeyId: ACCESS_KEY_ID_AWS,
            secretAccessKey: SECRET_ACCESS_KEY_AWS,
            signatureVersion: 'v4'
        }

        var s3 = new AWS.S3(options)

        const uploadParams = { Bucket: BUCKET_NAME_AWS, Key: '', Body: '' }
        const file = req.files.image.path

        const fileStream = fs.createReadStream(file)

        fileStream.on('error', (err) => {
            console.log('File error', err)
        })

        uploadParams.Body = fileStream
        uploadParams.Key = path.basename(file)

        s3.upload(uploadParams, (err, data) => {
            if (err?.code === 'RequestTimeTooSkewed') {
                message(res, 404, 'Tengo problemas para subir la imagen. Comprueba que tu fecha y hora sean correctas.\nPor favor, si el problema continúa comunicate con el desarrollador.', { err })
                return
            }
            if (err) {
                message(res, 500, 'Problemas al subir la imagen, recarga la pagina y vuelve a intentarlo.\nPor favor, si el problema continúa comunicate con el desarrollador.', { err })
                return
            } 

            if (data) {
                image = data.Key

                updateImageInMainProduct(image)
            }
        })
    }

    // --- para subir la imagen al bucket con aws-sdk
    uploadImageInBucket() 

    // --- para subir la imagen al un disk del server (de pago)
    const uploadImageInDisksServer = () => {
        let filePath = req.files.image.path
        let separator = /\u005C/.test(filePath) ? '\u005C' : '/'
        let fileSplit = filePath.split(separator)
        let fileName = fileSplit[2]
        let extSplit = fileName.split('.')
        let fileExp = extSplit[1]

        if (fileExp !== 'png' && fileExp !== 'jpg') {
            message(res, 404, 'La imagen no es válida. Extensiones permitidas: png y jpg')
            return
        }

        image = fileName

        updateImageInMainProduct(image)
    }

    // --- para subir la imagen al un disk del server (de pago)
    // uploadImageInDisksServer()
}

exports.showImage = (req, res) => {
    const { imageName } = req.params
    const filePath = `./uploads/image/${imageName}`
    
    if (!fs.existsSync(filePath)) {
        message(res, 404, 'La imagen que estás buscando no existe.')
        return
    }

    res.status(200).sendFile(path.resolve(filePath))
}

exports.getAllImages = (req, res) => {

    fs.readdir(path.resolve('./uploads/image'), (err, files) => {
        message(res, 200, '', { files })
        return
    })
}

exports.show = (req, res) => {
    let data = req.body

    if (data.mainProductsId) {
        data.forId = { _id: data.mainProductsId }  
    } else {
        data.forId = {}
    }
    
    MainProduct.find(data.forId).sort('order').exec((err, mainProducts) => {
        if (err) {
            message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
            return
        }
        if (mainProducts.length === 0) {
            message(res, 404, 'Aquí no hay nada.')
            return
        }

        if (mainProducts) {
            message(res, 200,'', { mainProducts })
        }
    })
}

exports.update = (req, res) => {
    const { id } = req.params
    const data = req.body

    MainProduct.findByIdAndUpdate(id, { image: data.title }, (err, mainProduct) => {
        if (err) {
            console.log("Hubo un problema", err)
            return
        }
        console.log("Ok", mainProduct)
    })

    // if (!data.title || !data.description) {
    //     message(res, 404, 'El título y la descripción del producto son obligatorios.')
    //     return
    // }

    // MainProduct.findByIdAndUpdate(id, data, (err, mainProduct) => {
    //     if (err?.code === 11000) {
    //         message(res, 404, 'El nombre del producto ya existe. Intenta otro.')
    //         return
    //     }
    //     if (err?.path === '_id') {
    //         message(res, 404, 'El producto que intentas actualizar no existe.')
    //         return
    //     }
    //     if (err || !mainProduct) {
    //         message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
    //         return
    //     }
    //     if (mainProduct) {
    //         message(res, 200, 'Producto actualizado correctamente.')
    //     }
    // })
}

exports.updateForCheckboxAndOrder = (req, res) => {
    const { id } = req.params
    const data = req.body

    MainProduct.findByIdAndUpdate(id, data, (err, mainProduct) => {
        if (err?.code === 11000) {
            message(res, 404, 'El nombre del producto ya existe. Intenta otro.')
            return
        }
        if (err?.path === '_id') {
            message(res, 404, 'El producto que intentas actualizar no existe.')
            return
        }
        if (err || !mainProduct) {
            message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
            return
        }
        if (mainProduct) {
            message(res, 200, 'Producto actualizado correctamente.')
        }
    })
}

exports.remove = (req, res) => {
    const { id } = req.params

    MainProduct.findByIdAndDelete(id, (err, mainProduct) => {
        if (err?.path === '_id') {
            message(res, 404, 'El producto que intentas eliminar no existe.')
            return
        }
        if (err || !mainProduct) {
            message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
            return
        }
        if (mainProduct) {
            message(res, 200, 'Producto eliminado correctamente.')
        }
    })
}