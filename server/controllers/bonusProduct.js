const BonusProduct = require('../models/bonusProduct')
const message = require('../utils/message')

exports.add = (req, res) => {
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

	const saveBonusProduct = () => {
		bonusProduct.save()
			.then(bonusProduct => {
				if (!bonusProduct) {
					message(res, 500, 'Ocurrió un error en el servidor, prueba más tarde.')
					return
				}

				message(res, 200, 'Complemento creado correctamente.')
			})
			.catch(err => {
				message(res, 500, 'Ocurrió un error en el servidor, prueba más tarde.')
			})
	}

	BonusProduct.find({ title: bonusProduct.title }, (err, bonusProductStored) => {
		if (bonusProductStored?.length === 0 || !bonusProductStored) {
			saveBonusProduct()
			return
		}

		const bonusProductOptionNew = bonusProduct.option
		const bonusProductOption0 = bonusProductStored[0] && bonusProductStored[0].option
		const bonusProductOption1 = bonusProductStored[1] && bonusProductStored[1].option

		if ( 
			bonusProductOptionNew === bonusProductOption0 || 
			bonusProductOptionNew === bonusProductOption1
		) {
			message(res, 404, `El complemento << ${bonusProduct.option} ${bonusProduct.title} >> ya existe. Prueba otro.`)
			return
		}

		saveBonusProduct()
	})
}

exports.show = (req, res) => {
    let data = req.body

    if (data.bonusProductsId) {
        data.forId = { _id: data.bonusProductsId }  
    } else {
        data.forId = {}
    }

	BonusProduct.find(data.forId).sort('order')
		.then(bonusProducts => {
			if (bonusProducts.length === 0 || !bonusProducts) {
				message(res, 404, 'No se encontraron complementos.')
				return
			}

			message(res, 200, '', { bonusProducts: bonusProducts })
		})
		.catch(err => {
			message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
			return
		})
}

exports.update = (req, res) => {
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

exports.updateForCheckboxAndOrder = (req, res) => {
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

exports.remove = (req, res) => {
	const { id } = req.params

	BonusProduct.findByIdAndDelete(id, (err, bonusProduct) => {
		if (err || !bonusProduct) {
			message(res, 500, 'Ocurrió un error en el servidor, intenta más tarde.')
			return
		}

		message(res, 200, 'Complemento eliminado correctamente.')
	})
}