
export const generateMessage = () => {
	let data = localStorage.getItem('basket')
	data = JSON.parse(data)

	const array = []
	let messageFinish = ''

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
			bonusProductsTrue[0] = '\n\t* ' + bonusProductsTrue[0]
			bonusProductsTrue = bonusProductsTrue.join('\n\t* ')
		} else {
			bonusProductsTrue = null
		}

		let messageStart = `**Quiero ${quantity} x ${title}**`
		let messageOptions = bonusProductsTrue ? ` ${'\n'}Con las siguientes opciones: ${'\n'}${bonusProductsTrue}` : '\nSin ninguna opción.\n' 

		let message = `${messageStart}${messageOptions}${'\n\n'}`

		array.push(message)
	})

	messageFinish = array.join('')
	messageFinish = encodeURI(messageFinish)

	return messageFinish
}