import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Typography, Grid, Button, Link, FormControl, FormLabel, TextField, FormControlLabel, RadioGroup, Radio, Checkbox, Fade } from '@mui/material'
import Products from '../../components/Products'
import { showBonusProductApi } from '../../api/bonusProduct'
import accounting from 'accounting'
import { generateMessage } from '../../utils/generateMessage'
import ModalMui from '../../components/ModalMui' 
import DialogMui from '../../components/DialogMui'
import exportStyleButtonDialog from "../../components/DialogMui/exportStyleButtonDialog"

import './ShoppingCart.css'

const ShoppingCart = () => {
	const [basket, setBasket] = useState([])
	const [total, setTotal] = useState(0)
	const [bonusProducts, setBonusProducts] = useState([])
	const [reloadBasket, setReloadBasket] = useState(false)
	const [reloadTotal, setReloadTotal] = useState(false)
	const [openModal, setOpenModal] = useState(false)
	const [openDialog, setOpenDialog] = useState(false)
	const [titleDialog, setTitleDialog] = useState('')
	const [contentDialog, setContentDialog] = useState(null)
	const [actionsDialog, setActionsDialog] = useState(null)

	const navigate = useNavigate()

	useEffect(() => {
		window.scroll(0,0)
	}, [])

	useEffect(() => {
		const totalStorage = localStorage.getItem('total')

		if (totalStorage && total === 0) {
			setTotal(totalStorage)
			return
		}

		if (totalStorage) {
			setTotal(Number.parseInt(totalStorage))
			setReloadTotal(false)
			return
		}

		localStorage.setItem('total', total)
		setReloadTotal(false)
	}, [reloadTotal])

	useEffect(() => {
		let basketStorage = localStorage.getItem('basket')

		if (!basketStorage) {
			setReloadBasket(false)
			setBasket([])
			return
		}

		basketStorage = JSON.parse(basketStorage)
		setBasket(basketStorage)
		
		setReloadBasket(false)
	}, [reloadBasket])

	useEffect(() => {
		showBonusProductApi()
			.then(response => setBonusProducts(response.bonusProducts))
	}, [])

	if (basket.length === 0) {
		return (
			<Fade in={true}>
				<div className='shopping-cart'>
					<Typography 
		                variant='h4' 
		                className={`category-title`}
		            >
		                Confirmá tu pedido
		            </Typography>
		            <Typography variant='h6'>
		            	Tu carrito de compras está vacío.
		            </Typography>
	            	<Button
	            		onClick={() => navigate('/products')}
	            	>
	            		Volver
	            	</Button>
				</div>
			</Fade>
		)
	}

	const clean = () => {
		const { styleButtonDialogConfirm, styleButtonDialogCancel } = exportStyleButtonDialog

		const remove = () => {
			localStorage.removeItem('basket')
			localStorage.setItem('total', 0)
			localStorage.setItem('basketLength', 0)
			navigate('/shopping-cart?basket=0')

			setReloadTotal(true)
			setReloadBasket(true)
		}

		setOpenDialog(true)
		setTitleDialog('Eliminando el carrito...')
		setContentDialog('¿Quieres eliminar todos los elementos del carrito?')
		setActionsDialog(
			<>
				<Button 
					style={styleButtonDialogCancel}
					variant="contained"
					onClick={() => setOpenDialog(false)}
					>
					Cancelar
				</Button>
				<Button 
					style={styleButtonDialogConfirm}
					variant="contained"
					onClick={remove}
				>
					Eliminar
				</Button>
			</>
		)
	}

	return (
		<>
			<Helmet>
				<title>Tu pedido | Rotisería Pepitos</title>
				<meta 
					name='description'
					content='Shopping Cart | Rotisería Pepitos'
					data-react-helmet='true'
				/>
			</Helmet>
			<Fade in={total}>
			<div className='shopping-cart'>
				<Typography 
	                variant='h4' 
	                className={`category-title`}
	            >
	                Confirmá tu pedido
	            </Typography>
	            <Typography>
	            	Presioná confirmar para generar el mensaje con tu pedido
	            </Typography>
	            <Typography>
	            	y enviarlo por WhatsApp
	            </Typography>
	            <Total total={total} setOpenModal={setOpenModal}/>
	            <Typography className='last-typography'>
	            <Button
	                className='btn-confirm'
	                variant='contained'
	                color='error'
	                onClick={clean}
	            >
	                Limpiar el carrito
	            </Button>
	            </Typography>
				<Products 
					allMainProducts={basket} 
					allBonusProducts={bonusProducts} 
					setTotal={() => {}} 
					total={total}
					setBasket={() => {}} 
					fromBasket={true} 
					reloadBasket={reloadBasket}
					reloadTotal={reloadTotal}
					setReloadBasket={setReloadBasket}
					setReloadTotal={setReloadTotal}
				/>
				<Typography 
	                variant='h4' 
	                className={`category-title`}
	            >
	                Confirmá tu pedido
	            </Typography>
	            <Typography>
	            	Presioná confirmar para generar el mensaje con tu pedido
	            </Typography>
	            <Typography>
	            	y enviarlo por WhatsApp
	            </Typography>
	            <Total total={total} setOpenModal={setOpenModal}/>
				<DialogMui 
					openDialog={openDialog} 
					setOpenDialog={setOpenDialog}
					titleDialog={titleDialog}
					contentDialog={contentDialog}
					actionsDialog={actionsDialog}
				/>
			</div>
			</Fade>
		</>
	)
}

const FormAddress = () => {
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
		<form className='form-address' onSubmit={e => send(e)}>
			<Grid container>
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
				<FormControl>
					<FormLabel id='radio-buttons'>Cuando esté listo mi pedido...</FormLabel>
					<RadioGroup
						defaultValue='option-0'
						aria-labelledby='radio-buttons'
					>
						<FormControlLabel 
							value='option-0' 
							control={<Radio defaultChecked />} 
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

const Total = ({ total, setOpenModal }) => {
	const navigate = useNavigate()

	const confirm = () => {
		setOpenModal(true)
	}

	return (
		<div className='shopping-cart__total'>
			<Typography variant='h5'>
				Total
			</Typography>
			<Typography variant='h5'>
			{accounting.formatMoney(total, '$')}
			</Typography>
			<br/>
     		<Button
                className='btn-confirm'
                variant='contained'
                color='success'
                onClick={() => navigate('/confirm')}
            >
                Confirmar
            </Button>
		</div>
	)
}

export default ShoppingCart