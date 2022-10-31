const BonusProduct = require('../models/bonusProduct')
const message = require('../utils/message')

const add = (req, res) => {
	const data = req.body

	if (!data?.title || !data) {
		message(res, 404, 'El nombre del complemento es obligatorio.')
		return
	}

	if (!data?.option) {
		message(res, 404, 'Ocurrió un error interno, si el problema continúa comunicate conmigo, por favor.')
		return
	}

	const bonusProduct = new BonusProduct(data)

	bonusProduct.title = bonusProduct.title.toLowerCase()

	bonusProduct.save()
		.then(bonusProduct => {
			if (!bonusProduct) {
				message(res, 500, 'Ocurrió un error en el servidor, prueba más tarde.')
				return
			}

			message(res, 200, 'Complemento creado correctamente.')
		})
		.catch(err => {
			if (err?.code === 11000) {
				message(res, 404, 'El nombre de ese complemento ya existe, prueba otro.', { err })
				return
			}

			message(res, 500, 'Ocurrió un error en el servidor, prueba más tarde.')
		})
}

const show = (req, res) => {

	BonusProduct.find({}, (err, bonusProducts) => {
		if (err) {
			message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
			return
	}	
		if (bonusProducts.length === 0 || !bonusProducts) {
			message(res, 404, 'No se encontraron complementos.')
			return
		}

		message(res, 200, '', { bonusProducts: bonusProducts })
	})
}

const update = (req, res) => {
	const { id } = req.params
	const data = req.body

	if (!data.title) {
		message(res, 404, 'El nombre del complemento es obligatorio.')
		return
	}

	BonusProduct.findByIdAndUpdate(id, data, (err, bonusProduct) => {
		if (err?.code === 11000) {
			message(res, 404, 'El nombre de ese complemento ya existe, prueba otro.', { err })
			return
		}
		if (err?.path === '_id') {
			message(res, 404, 'El complemento que intentas editar no existe.')
			return
		}
		if (err || !BonusProduct) {
			message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.', { err })
			return
		}

		message(res, 200, 'Complemento actualizado correctamente.')
	})
}

const updateForCheckboxAndOrder = (req, res) => {
	const { id } = req.params
	const data = req.body


	BonusProduct.findByIdAndUpdate(id, data, (err, BonusProduct) => {
		if (err || !BonusProduct) {
			message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.', { err })
			return
		}

		message(res, 200, 'Complemento actualizado correctamente.')
	})
}

const remove = (req, res) => {
	const { id } = req.params

	BonusProduct.findByIdAndDelete(id, (err, bonusProduct) => {
		if (err || !bonusProduct) {
			message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
			return
		}

		message(res, 200, 'Complemento eliminado correctamente.')
	})
}

module.exports = {
	add, show, update, updateForCheckboxAndOrder, remove
}