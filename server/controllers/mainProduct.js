const MainProduct = require('../models/mainProduct') 
const Category = require('../models/category')
const message = require('../utils/message')
const fs = require('fs')
const path = require('path')

const add = (req, res) => {
    const data = req.body
    console.log(data)

    // console.log(data, files)
    // return

    if (!data.title || !data.description) {
        message(res, 404, 'El título y la descripción del producto son obligatorios.')
        return
    }

    // message(res, 200, '', { files })
    // console.log(req.files.image)

    // return

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

const addImage = (req, res) => {
    const { id } = req.params
    let image = ''

    if (!req.files || !id) {
        message(res, 404, 'La imagen y el Id del producto son obligatorios.')
        return
    }

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

const showImage = (req, res) => {
    const { imageName } = req.params
    const filePath = `./uploads/image/${imageName}`
    
    if (!fs.existsSync(filePath)) {
        message(res, 404, 'La imagen que estás buscando no existe.')
        return
    }

    res.status(200).sendFile(path.resolve(filePath))
}

const show = (req, res) => {
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

const update = (req, res) => {
    const { id } = req.params
    const data = req.body

    if (!data.title || !data.description) {
        message(res, 404, 'El título y la descripción del producto son obligatorios.')
        return
    }

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

const updateForCheckboxAndOrder = (req, res) => {
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

const remove = (req, res) => {
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

module.exports = {
    add, addImage, showImage, show, update, updateForCheckboxAndOrder, remove
}