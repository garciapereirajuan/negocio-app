import { useEffect, useState } from 'react'
import { generateMessage } from '../../utils/generateMessage'
import { Grid, Typography, FormControl, FormLabel, FormControlLabel, TextField, RadioGroup, Button, Radio } from '@mui/material'

import './Confirm.css'

const Confirm = () => {
	const [formData, setFormData] = useState({})
	const [movil, setMovil] = useState(false)

	useEffect(() => {
		if (!formData.address) {
			return
		}

		if (formData.address === 'option-0') {
			formData.addressText = ''
		}

		if (formData.address === 'option-a') {
			formData.addressText = '*Lo paso a buscar*, avisame el horario, por favor.'
		}

		if (formData.address === 'option-b') {
			formData.addressText = `*Traelo cuando esté listo*, por favor.\n*Dirección:* ${formData.addressName && formData.addressName}`
		}
	}, [formData])

	useEffect(() => {

		if( navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
		) {
			setMovil(true)
		} else {
			setMovil(false)
		}

	}, [])

	const send = async (e) => {
		e.preventDefault()

		await localStorage.setItem('dataAddress', JSON.stringify(formData))

		let message = generateMessage()

		if (movil) {
			window.open(`https://wa.me/542923657103?text=${message}`, '_blank')
		} else {
			window.open(`http://web.whatsapp.com/send?text=${message}&phone=+542923657103&abid=+542923657103`, '_blank')
		}
	}

	return (
		<form className='form-confirm' onSubmit={e => send(e)}>
			<Grid container className='form-confirm__grid'>
				<Grid item xs={12}>
					<Typography variant='h6' align='center'>
						Completá los siguientes campos
					</Typography>
					<Typography align='center'>
						(recorda que todo esto opcional)
					</Typography>
				</Grid>	
				<br/>
				<Grid item xs={12} >
					<FormControl>
						<FormLabel>
							El pedido es a nombre de...
						</FormLabel>
						<TextField 
							placeholder='Fulanito'
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value})}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={12} className='form-confirm__grid__form-options'>
					<FormControl>
						<FormLabel id='radio-buttons-2'>Lo quiero...</FormLabel>
						<RadioGroup
							defaultValue='option-a'
							aria-labelledby='radio-buttons-2'
						>
							<FormControlLabel 
								value='option-a' 
								control={<Radio />} 
								label='Cuando esté listo'
								onChange={e => setFormData({ ...formData, hour: e.target.value })} 
							/>
							<FormControlLabel 
								value='option-b' 
								control={<Radio />} 
								label='Para una hora en particular...'
								onChange={e => setFormData({ ...formData, hour: e.target.value })}
							/>
						</RadioGroup>
					</FormControl>
					<FormControl>
						{
							formData.hour === 'option-b' && (
								<>
									<FormLabel>Es válido escribir "a las 12 y media", por ejemplo</FormLabel>
									<TextField 
										placeholder='12:30 hs'
										value={formData.addressName}
										onChange={e => setFormData({ ...formData, addressName: e.target.value})}
									/>
								</>
							)
						}
					</FormControl>
				</Grid>
				<Grid item xs={12} className='form-confirm__grid__form-options'>
					<FormControl>
						<FormLabel id='radio-buttons'>Cuando esté listo mi pedido...</FormLabel>
						<RadioGroup
							defaultValue='option-0'
							aria-labelledby='radio-buttons'
						>
							<FormControlLabel 
								value='option-0' 
								control={<Radio />} 
								label='Ninguna opción'
								onChange={e => setFormData({ ...formData, address: e.target.value })} 
							/>
							<FormControlLabel 
								value='option-a' 
								control={<Radio />} 
								label='Lo paso a buscar'
								onChange={e => setFormData({ ...formData, address: e.target.value })} 
							/>
							<FormControlLabel 
								value='option-b' 
								control={<Radio />} 
								label='Traelo a la siguiente dirección...'
								onChange={e => setFormData({ ...formData, address: e.target.value })}
							/>
						</RadioGroup>
					</FormControl>
					<FormControl>
						{
							formData.address === 'option-b' && (
								<>
									<FormLabel>Es válido escribir "a la casa de tal persona"</FormLabel>
									<TextField 
										placeholder='Calle y número'
										value={formData.addressName}
										onChange={e => setFormData({ ...formData, addressName: e.target.value})}
									/>
								</>
							)
						}
					</FormControl>
				</Grid>
				<FormControl>
					<Button className='btn-submit' variant='contained' type='submit'>
						Enviar pedido
					</Button>
					<Typography align='center' color='#808080'>
						<b>NOTA: </b> 
						no te preocupes si el mensaje no se ve muy bien, se va a ver bien cuando lo mandes.
					</Typography>
				</FormControl>
			</Grid>
		</form>
	)
}

export default Confirm