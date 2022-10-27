import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, FormControl, FormGroup, FormControlLabel, TextField, Button, Checkbox, Alert } from '@mui/material'
import ModalMui from '../../ModalMui'
import { getAccessTokenApi } from '../../../api/auth'
import { addBonusProductApi } from '../../../api/bonusProduct'

import DeleteIcon from '@mui/icons-material/Delete'

const AddEditBonusProduct = () => {
	const [openModal, setOpenModal] = useState(true)
	const [bonusProductData, setBonusProductData] = useState({})
	const [alert, setAlert] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		setBonusProductData({ 
			visible: true,
			disponibility: true,
			checked: false
		})
	}, [])

  useEffect(() => {
    if (openModal === null) {
        setOpenModal(true)
        return
    }

		if (openModal === false) {
	        navigate('/admin/products')
	        return
		}
	}, [openModal, navigate])

	const addBonusProduct = (e) => {
		e.preventDefault()
		const token = getAccessTokenApi()
		const { title } = bonusProductData

		if (!title) {
			setAlert(['error', 'El título del complemento es obligatorio.'])
			return
		}

		addBonusProductApi(token, bonusProductData)
			.then(response => {
				if (!response) {
					setAlert(['error', 'Ocurrió un error en el servidor, intenta más tarde.'])
					return
				}
				if (response.code !== 200) {
					setAlert(['error', response.message])
					return
				}

				setAlert(['success', response.message])
				navigate('/admin/products')
			})
			.catch(err => {
				setAlert(['error', 'Ocurrió un error en el servidor, intenta más tarde.'])
			})
	}

	const editBonusProduct = (e) => {
		e.preventDefault()
		const token = getAccessTokenApi()
		const { title } = bonusProductData
	}

	return(
		<ModalMui 
			openModal={openModal}
			setOpenModal={setOpenModal}
			contentModal={
				<FormBonusProduct 
					setOpenModal={setOpenModal}
					bonusProductData={bonusProductData}
					setBonusProductData={setBonusProductData}
					alert={alert}
					setAlert={setAlert}
					addBonusProduct={addBonusProduct}
					editBonusProduct={editBonusProduct}
				/>
			}
		/>
	)
}

const FormBonusProduct = ({ 
		setOpenModal, bonusProductData, setBonusProductData, 
		alert, setAlert, addBonusProduct, editBonusProduct 
	}) => {

	const checkObjectBonusProductData = false

	return(
		<Box className='add-edit-form'>
	        <Typography
	            color='#373737'
	            textAlign='right'
	        >
            <span
                className='format-icon'
                onClick={() => setOpenModal(false)}
            >
                X
            </span>
	        </Typography>
	        <Typography variant='h5' color='#373737' textAlign='center'>
	            {checkObjectBonusProductData ? "Editar" : "Nuevo"} complemento
	        </Typography>
	        	{alert.length !== 0 && <Alert severity={alert[0]}>{alert[1]}</Alert>}
	        <form
	            className='add-edit-form__form'
	            onSubmit={!checkObjectBonusProductData ? addBonusProduct : editBonusProduct}
	            onChange={() => setAlert([])}
	        >
	            <Grid container className='add-edit-form__form__box'>
	                <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
	                    <FormControl>
	                        <TextField
	                            label='Nombre'
	                            placeholder='Pizzas'
	                            value={bonusProductData.title}
	                            onChange={e => setBonusProductData({ ...bonusProductData, title: e.target.value })}
	                        />
	                    </FormControl>
	                </Grid>
	                <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
	                    <FormControl>
	                        <TextField
	                            label='Descripción (opcional)'
	                            placeholder={
	                                bonusProductData.title
	                                    ? `Alguna descripción sobre "${bonusProductData.title}"`
	                                    : 'Alguna descripción'
	                            }
	                            value={bonusProductData.description}
	                            onChange={e => setBonusProductData({ ...bonusProductData, description: e.target.value })}
	                        />
	                    </FormControl>
	                </Grid>
	                <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
                    <FormControl>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox defaultChecked />}
                          label="Visible"
                          checked={bonusProductData.visible}
                          onChange={(e) => setBonusProductData({ ...bonusProductData, visible: e.target.checked })}
                        />
                        <FormControlLabel
                          control={<Checkbox defaultChecked />}
                          label="Está disponible"
                          checked={bonusProductData.disponibility}
                          onChange={(e) => setBonusProductData({ ...bonusProductData, disponibility: e.target.checked })}
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Seleccionado por defecto"
                          checked={bonusProductData.checked}
                          onChange={(e) => setBonusProductData({ ...bonusProductData, checked: e.target.checked })}
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>	
	                <br />
	                <FormControl>
	                    <Button
	                        type='submit'
	                        variant='contained'
	                        className='btn-submit'
	                    >
	                        {/*{checkObjectBonusProductData ? "Guardar" : "Crear"}*/}
	                    </Button>
	                </FormControl>
	            </Grid>
	        </form>
	    </Box >
	)
}

export default AddEditBonusProduct