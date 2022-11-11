import moment from 'moment'

export const generateMessage = () => {
	let data = localStorage.getItem('basket')
	let dataAddress = localStorage.getItem('dataAddress')
	data = JSON.parse(data)
	dataAddress = JSON.parse(dataAddress)

	const array = []
	let messageFinish = ''
	let space = '*--------------------------------*'
	let greeting = ''

	if (moment().hours() <= 12) {
		greeting = 'Buenos días.'
	} 
	if (moment().hours() > 12) {
		greeting = 'Buenas tardes.'
	}
	if (moment().hours() > 20) {
		greeting = 'Buenas noches.'
	}

	if (dataAddress.name) {
		greeting = `${greeting}\nEste pedido es a nombre de ${dataAddress.name}`
	}

	if (dataAddress.address) {
		greeting = `${greeting}\n${dataAddress.addressText}`
	}

	data.forEach(item => {
		let title = item.title
		let quantity = item.quantity
		let bonusProductsOk = item.bonusProductsOk
		let bonusProductsTrue = []

		for (const bonus in bonusProductsOk) {
			if (bonusProductsOk[bonus]) {
				bonusProductsTrue.push(bonus)
			} 
		}

		if (bonusProductsTrue.length !== 0) {
			bonusProductsTrue[0] = '\n\t*-* ' + bonusProductsTrue[0]
			bonusProductsTrue = bonusProductsTrue.join('\n\t*-* ')
		} else {
			bonusProductsTrue = null
		}

		let messageStart = `*${quantity} x ${title}*`
		let messageOptions = bonusProductsTrue ? ` ${'\n'}Con las siguientes opciones: ${'\n'}${bonusProductsTrue}` : '\nSin ninguna opción.'

		let message = `${messageStart}${messageOptions}\n${space}\n`

		array.push(message)
	})

	messageFinish = array.join('')
	messageFinish = encodeURI(`${greeting}\n\nMi pedido es:\n${space}\n${messageFinish}`)

	return messageFinish
}