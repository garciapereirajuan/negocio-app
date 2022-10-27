const BonusProduct = require('../models/bonusProduct')
const message = require('../utils/message')

const add = (req, res) => {
	const data = req.body

	if (!data?.title || !data) {
		message(res, 404, 'El nombre del complemento es obligatorio.')
		return
	}

	const bonusProduct = new BonusProduct(data)

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

module.exports = {
	add, show
}