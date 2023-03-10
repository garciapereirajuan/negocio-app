const Category = require('../models/category')
const message = require('../utils/message')

exports.add = (req, res) => {
    const data = req.body

    if (!data.title) {
        message(res, 404, 'El nombre de la categoría es obligatorio.')
        return
    }

    const category = new Category(data)

    category.save()
        .then(category => {
            if (!category) {
                message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
                return
            }

            message(res, 200, 'Categoría agregada correctamente.')
        })
        .catch(err => {
            if (err?.code === 11000) {
                message(res, 404, 'Ya existe una categoría con este nombre, intenta otro.', { err })
                return
            }

            message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
        })
}

exports.show = (req, res) => {

    Category.find({}).sort('order').exec((err, categories) => {
        if (err) {
            message(res, 500, 'Ocurrió un error en el servidor, intent más tarde.')
            return
        }
        if (categories.length === 0 || !categories) {
            message(res, 404, 'No se encontró ninguna categoría.')
            return
        }
        if (categories) {
            message(res, 200, '', { categories: categories })
        }
    })
}

exports.update = (req, res) => {
    const { id } = req.params
    const data = req.body

    if (!data.title) {
        message(res, 404, 'El nombre de la categoría es obligatorio.')
        return
    }

    
    Category.findByIdAndUpdate(id, data, (err, category) => {
        if (err?.code === 11000) {
            message(res, 404, 'Ya existe una categoría con este nombre, intenta otro.', { err })
            return
        }

        if (err) {
            message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
            return
        }

        if (!category) {
            message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
            return
        }

        message(res, 200, 'Categoría actualizada correctamente.')
    })
}

exports.updateOrder = (req, res) => {
    const { id } = req.params
    const data = req.body
    
    Category.findByIdAndUpdate(id, data, (err, category) => {
        if (err?.code === 11000) {
            message(res, 404, 'Ya existe una categoría con este nombre, intenta otro.', { err })
            return
        }

        if (err) {
            message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
            return
        }

        if (!category) {
            message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
            return
        }

        message(res, 200, 'Categoría actualizada correctamente.')
    })
}

exports.remove = (req, res) => {
    const { id } = req.params

    Category.findByIdAndDelete(id, (err, category) => {
        if (err) {
            message(res, 500, 'Ocurrió un error interno, intenta más tarde.')
            return
        }
        if (!category) {
            message(res, 500, 'Ocurrió un error interno, intenta más tarde.')   
            return
        }

        message(res, 200, 'Categoría eliminada correctamente.')
    })
}