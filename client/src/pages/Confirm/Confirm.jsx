import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { generateMessage } from '../../utils/generateMessage'
import { 
	Grid, Typography, FormControl, FormLabel, 
	FormControlLabel, TextField, RadioGroup, Button, 
	Radio, Alert, Fade
} from '@mui/material'
import AlertCollapse from "../../components/AlertCollapse"
import DialogMui from "../../components/DialogMui"
import exportStyleButtonDialog from "../../components/DialogMui/exportStyleButtonDialog"

import './Confirm.css'

const Confirm = () => {
	const [formData, setFormData] = useState({})
	const [alert, setAlert] = useState([])
	const [movil, setMovil] = useState(false)
	const [openDialog, setOpenDialog] = useState(false)
	const [titleDialog, setTitleDialog] = useState("")
	const [contentDialog, setContentDialog] = useState(null)
	const [actionsDialog, setActionsDialog] = useState(null)

	useEffect(() => {
		let dataAddress = localStorage.getItem('dataAddress')

		if (dataAddress) {
			dataAddress = JSON.parse(dataAddress)

			setFormData({ ...formData, name: dataAddress.name })
			return
		}

		setFormData({
			...formData,
			time: 'option-0',
			address: 'option-0'
		})
	}, [])

	useEffect(() => {
		setAlert([])
	}, [])

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

	const filterString = (string) => {
		if (/^(\s+)$/.test(string)) {
			return ""
		}

		if (string.length < 3) {
			return null
		}

		return string.match(/\S+/g).join(" ");
	}

	const confirmSend = (save, formData) => {
		localStorage.setItem('dataAddress', JSON.stringify(formData))
		
		let message = generateMessage()
		
		if (!save) {
			localStorage.removeItem("basket")
			localStorage.removeItem("basketLength")
			localStorage.removeItem("total")
		}

		if (movil) {
			window.open(`https://wa.me/542923657103?text=${message}`, '_blank')
		} else {
			window.open(`http://web.whatsapp.com/send?text=${message}&phone=+542923657103&abid=+542923657103`, '_blank')
		}

		window.location.href = "/"
	}

	const send = async (e) => {
		e.preventDefault()

		if (formData.name) {
			formData.name = filterString(formData.name);
		}

		if (formData.name === null) {
			setAlert(['error', "Tu nombre debe contener al menos 3 letras"])
			return
		}

		if (formData.time === 'option-b') {
			formData.timeDefined = filterString(formData.timeDefined)

			if (!formData.timeDefined) {
				setAlert(['error', 'Indicá a qué hora querés tu pedido'])
				return
			}
		}

		if (formData.time === 'option-0') {
			formData.timeText = null
		}

		if (formData.time === 'option-a') {
			formData.timeText = '*Lo quiero ni bien esté listo*.'
		}

		if (formData.time === 'option-b') {
			formData.timeText = `*Lo quiero para este momento:* ${formData.timeDefined}`
		}

		if (formData.address === 'option-0') {
			formData.addressText = null
		}

		if (formData.address === 'option-a') {
			formData.addressText = '*Lo paso a buscar.*'
		}

		if (formData.address === 'option-b') {
			formData.addressText = `*Traelo a este lugar:* ${formData.addressName && formData.addressName}`
		}

		if (formData.address === 'option-b') {
			formData.addressName = filterString(formData.addressName)

			if (!formData.addressName) {
				setAlert(['error', 'Encargaste el pedido con deliberi, pero no indicaste el lugar'])
				return
			}
		}

		setAlert(['success', 'Generando el pedido y abriendo WhatsApp... Espera'])

		const { styleButtonDialogConfirm, styleButtonDialogCancel } = exportStyleButtonDialog

		setOpenDialog(true)
		setTitleDialog("Preparando el mensaje...")
		setContentDialog(
			<div>
				Podes dejar guardado tu pedido para la próxima vez.<br/>
				¿Querés guardarlo o eliminarlo?
			</div>
		)
		setActionsDialog(
			<div style={{padding: "0 20px"}}>
				<Button
					style={{...styleButtonDialogCancel, margin: "2px 4px"}}
					variant="contained"
					onClick={() => { setOpenDialog(false); setAlert([]) }}
				>
					Cancelar
				</Button>
				<Button 
					style={{...styleButtonDialogConfirm, margin: "2px 4px"}}
					variant="contained"
					onClick={() => confirmSend(false, formData)}
				>
					Enviar y eliminarlo
				</Button>
				<Button
					style={{...styleButtonDialogConfirm, margin: "2px 4px"}}
					variant="contained"
					onClick={() => confirmSend(true, formData)}
				>
					Enviar y guardarlo
				</Button>
			</div>
		)
	}

	const styleButtonSubmit = {
		backgroundColor: "#d95d39",
		color: "#373737",
		marginBottom: "6px"
	}

	return (
		<>
			<Helmet>
				<title>Tus datos | Rotisería Pepitos</title>
				<meta 
					name='description'
					content='Delibery Data | Rotisería Pepitos'
					data-react-helmet='true'
				/>
			</Helmet>
			<DialogMui 
				openDialog={openDialog} 
				setOpenDialog={setOpenDialog} 
				titleDialog={titleDialog} 
				contentDialog={contentDialog} 
				actionsDialog={actionsDialog} 
			/>
			<Fade in={true}>
				<div className='container-form-confirm'>
					<form className='form-confirm' onSubmit={e => send(e)} onChange={() => setAlert([])}>
						<Grid container className='form-confirm__grid'>
							<Grid item xs={12} className='form-confirm__grid__out'>
								<Typography variant='h6' align='center'>
									Completá el formulario
								</Typography>
								<Typography align='center'>
									(opcional)
								</Typography>
							</Grid>	
							<br/>
							<Grid item xs={12} className='form-confirm__grid__out'>
								<FormControl>
									<FormLabel>
										El pedido es a nombre de...
									</FormLabel>
									<TextField 
										placeholder='Juan'
										value={formData.name}
										onChange={(e) => { setFormData({ ...formData, name: e.target.value})}}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12} className='form-confirm__grid__form-options'>
								<FormControl>
									<FormLabel id='radio-buttons-2'>Lo quiero para este horario:</FormLabel>
									<RadioGroup
										defaultValue={'option-0'}
										aria-labelledby='radio-buttons-2'
									>
										<FormControlLabel 
											value='option-0'
											control={<Radio />}
											label='Ninguna opción'
											onChange={e => setFormData({ ...formData, time: e.target.value })}
										/>
										<FormControlLabel 
											value='option-a' 
											control={<Radio />} 
											label='Cuando esté listo'
											onChange={e => setFormData({ ...formData, time: e.target.value })} 
										/>
										<FormControlLabel 
											value='option-b' 
											control={<Radio />} 
											label='Para un momento en particular...'
											onChange={e => setFormData({ ...formData, time: e.target.value })}
										/>
									</RadioGroup>
								</FormControl>
								<FormControl>
									{
										formData.time === 'option-b' && (
											<>
												<FormLabel>{`<< para las 12:30hs >> `} ó {` << para tal día >>`}</FormLabel>
												<TextField 
													placeholder='12:30 hs'
													value={formData.timeDefined}
													onChange={e => setFormData({ ...formData, timeDefined: e.target.value})}
												/>
											</>
										)
									}
								</FormControl>
							</Grid>
							<Grid item xs={12} className='form-confirm__grid__form-options'>
								<FormControl>
									<FormLabel id='radio-buttons'>Lo quiero para esta ubicación:</FormLabel>
									<RadioGroup
										defaultValue={'option-0'}
										aria-labelledby='radio-buttons'
									>
										<FormControlLabel 
											value='option-0' 
											control={<Radio />} 
											label='Ninguna opción'
											onChange={e => setFormData({ ...formData, address: e.target.value, addressName: null })} 
										/>
										<FormControlLabel 
											value='option-a' 
											control={<Radio />} 
											label='Lo paso a buscar'
											onChange={e => setFormData({ ...formData, address: e.target.value, addressName: null })} 
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
												<FormLabel>{`<< a la casa de... >>`} ó {`<< a la calle... >>`}</FormLabel>
												<TextField 
													placeholder='A mi casa'
													value={formData.addressName}
													onChange={e => setFormData({ ...formData, addressName: e.target.value})}
												/>
											</>
										)
									}
								</FormControl>
							</Grid>
							<AlertCollapse alert={alert} setAlert={setAlert} />
							<FormControl>
								<Button className='btn-submit' variant='contained' type='submit' style={styleButtonSubmit}>
									Enviar pedido
								</Button>
								<Typography align='center'>
									<b>NOTA: </b> 
									**el mensaje va a verse así de raro**, pero se va a ver bien cuando lo mandes. 
									<span style={{color: "#d95d39"}}>
										{" "}<em>Envialo como está.</em>
									</span>
								</Typography>
							</FormControl>
						</Grid>
					</form>
				</div>
			</Fade>
		</>
	)
}

export default Confirm