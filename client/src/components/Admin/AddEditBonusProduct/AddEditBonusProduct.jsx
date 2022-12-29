import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { Box, Typography, Grid, FormControl, FormGroup, FormControlLabel, TextField, InputLabel, Select, MenuItem, Button, Checkbox, Alert } from '@mui/material'
import ModalMui from '../../ModalMui'
import { getAccessTokenApi } from '../../../api/auth'
import { addBonusProductApi, updateBonusProductApi } from '../../../api/bonusProduct'

import DeleteIcon from '@mui/icons-material/Delete'

const AddEditBonusProduct = () => {
	const [openModal, setOpenModal] = useState(true)
	const [bonusProductData, setBonusProductData] = useState({})
	const [alert, setAlert] = useState([])
	const navigate = useNavigate()

	const location = useLocation()

	useEffect(() => {
		setBonusProductData({ 
			visible: true,
			stock: true,
			checked: false,
			option: 'sin'
		})

		const query = queryString.parse(location.search)

		if (Object.keys(query).length === 0) {
			return
		}

		const objData = JSON.parse(query.data)
		setBonusProductData({
			...objData
		})

	}, [location])

  useEffect(() => {
    if (openModal === null) {
        setOpenModal(true)
        return
    }

		if (openModal === false) {
	        navigate('/admin/products?bonuspage=true')
	        return
		}
	}, [openModal, navigate])

	const addBonusProduct = (e) => {
		e.preventDefault()
		const token = getAccessTokenApi()
		const { title, option } = bonusProductData

		if (!title) {
			setAlert(['error', 'El título del complemento es obligatorio.'])
			return
		}

		if (!option) {
			setAlert(['error', 'Ocurrió un error, si el problema persiste avisame, por favor.'])
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
				setOpenModal(false)
			})
			.catch(err => {
				setAlert(['error', 'Ocurrió un error en el servidor, intenta más tarde.'])
			})
	}

	const editBonusProduct = (e) => {
		e.preventDefault()
		const token = getAccessTokenApi()

		updateBonusProductApi(token, bonusProductData._id, bonusProductData)
			.then(response => {
				if (!response) {
					setAlert(['error', 'Ocurrió un error en el servidor, intenta más tarde.'])
					return
				}
				if (response?.code !== 200) {
					setAlert(['error', response.message])
					return
				}

				setAlert(['success', response.message])
				setOpenModal(false)
			})
			.catch(err => {
				setAlert(['error', 'Ocurrió un error en el servidor, intent más tarde.'])
			})
	}

	if (Object.keys(bonusProductData).length === 0) {
		return
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

	const [checkObjectBonusProductData, setCheckObjectBonusProductData] = useState(false)

	useEffect(() => {
		const bonusProductDataIsEmpty = Object.keys(bonusProductData)

		if (!bonusProductData.title) {
			setCheckObjectBonusProductData(false)
			return
		}

		setCheckObjectBonusProductData(true)
	}, [])

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
	                <Grid container item xs={12} sm={12} md={5.8} lg={5.8} >
              			<Grid item xs={3} sm={2} md={4} lg={4}>
	              			<FormControl className='add-edit-form__bonus__select'>
	              				<InputLabel>Opción</InputLabel>
	              				<Select
	                          label='Opción'
	                          value={bonusProductData.option || 'sin'}
	                          onChange={(e) => setBonusProductData({ ...bonusProductData, option: e.target.value })}
	                      >
	                      	<MenuItem value='sin'>Sin</MenuItem>
	                      	<MenuItem value='con'>Con</MenuItem>
	                      	<MenuItem value='de'>De</MenuItem>
	                      	<MenuItem value='cocción'>Cocción</MenuItem>
	                      	<MenuItem value='consulta'>Consulta</MenuItem>
	                      </Select>
	          					</FormControl>
              			</Grid>
              			<Grid item xs={9} sm={10} md={8} lg={8}>
	              			<FormControl>
	                      <TextField
	                          label='Nombre'
	                          placeholder='ketchup'
	                          value={bonusProductData.title}
	                          onChange={e => setBonusProductData({ ...bonusProductData, title: e.target.value })}
	                      />
	            				</FormControl>
                  	</Grid>
	                </Grid>
	                <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
	                    <FormControl>
	                        <TextField
	                            label='Precio (opcional)'
	                            placeholder={'400'}
	                            value={bonusProductData.price}
	                            onChange={e => setBonusProductData({ ...bonusProductData, price: e.target.value })}
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
                          label="Hay stock"
                          disabled={bonusProductData.option === 'sin'}
                          checked={bonusProductData.stock}
                          onChange={(e) => setBonusProductData({ ...bonusProductData, stock: e.target.checked })}
                        />
                        {/*<FormControlLabel
                          control={<Checkbox />}
                          label="Seleccionado por defecto"
                          checked={bonusProductData.checked}
                          onChange={(e) => setBonusProductData({ ...bonusProductData, checked: e.target.checked })}
                        />*/}
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
	                        {checkObjectBonusProductData ? "Guardar" : "Crear"}
	                    </Button>
	                </FormControl>
	            </Grid>
	        </form>
	    </Box >
	)
}

export default AddEditBonusProduct