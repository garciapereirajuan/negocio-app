import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, FormControl, TextField, Button, Alert, InputLabel, Select, OutlinedInput, MenuItem, Chip } from '@mui/material'
import { getAccessTokenApi } from '../../../api/auth'
import { showMainProductApi } from '../../../api/mainProduct'
import { addCategoryApi } from '../../../api/categories'
import ModalMui from '../../ModalMui'

import '../../../css/AddEditForm.css'

const AddEditCategory = () => {
    const [openModal, setOpenModal] = useState(null)
    const [allMainProducts, setAllMainProducts] = useState([])
    const [categoryData, setCategoryData] = useState({})
    const [alert, setAlert] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        showMainProductApi()
            .then(response => setAllMainProducts(response.mainProducts))
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

    const addCategory = (e) => {
        e.preventDefault()
        const token = getAccessTokenApi()
        const { title, description } = categoryData

        if (!title || !description) {
            setAlert(['error', 'El título y la descripción de la categoría son obligatorios.'])
            return
        }

        categoryData.order = 1000

        addCategoryApi(token, categoryData)
            .then(response => console.log(response))
    }

    return (
        <ModalMui
            openModal={openModal}
            setOpenModal={setOpenModal}
            contentModal={
                <FormCategory
                    setOpenModal={setOpenModal}
                    allMainProducts={allMainProducts}
                    categoryData={categoryData}
                    setCategoryData={setCategoryData}
                    addCategory={addCategory}
                    alert={alert}
                    setAlert={setAlert}
                />
            }
        />
    )
}

const FormCategory = ({ setOpenModal, allMainProducts, categoryData, setCategoryData, addCategory, alert, setAlert }) => {
    const [mainProductsSelect, setMainProductsSelect] = useState([])

    useEffect(() => {
        const mainProductArray = []

        mainProductsSelect.forEach(mainProduct => {
            mainProductArray.push(getValueOfMainProductSelect(mainProduct)[0])
        })

        setCategoryData({ ...categoryData, mainProducts: mainProductArray })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainProductsSelect])

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setMainProductsSelect(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const getValueOfMainProductSelect = (key) => {
        return key.split('-');
    }

    return (
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
                Nueva categoría
            </Typography>
            {alert.length !== 0 && <Alert severity={alert[0]}>{alert[1]}</Alert>}
            <form
                className='add-edit-form__form'
                onSubmit={addCategory}
                onChange={() => setAlert([])}
            >
                <Grid container className='add-edit-form__form__box'>
                    <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
                        <FormControl>
                            <TextField
                                label='Nombre'
                                placeholder='Pizzas'
                                value={categoryData.title}
                                onChange={e => setCategoryData({ ...categoryData, title: e.target.value })}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
                        <FormControl>
                            <TextField
                                label='Descripción'
                                placeholder={
                                    categoryData.title
                                        ? `Todos los productos del tipo ${categoryData.title}`
                                        : 'Todas las pizzas'
                                }
                                value={categoryData.description}
                                onChange={e => setCategoryData({ ...categoryData, description: e.target.value })}
                            />
                        </FormControl>
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
                        <FormControl>
                            <InputLabel id='label-bonus'>Asociar al producto (opcional)</InputLabel>
                            <Select
                                labelId='label-bonus'
                                id='multiple-bonus'
                                multiple
                                value={mainProductsSelect}
                                onChange={handleChange}
                                input={<OutlinedInput id='select-multiple-bonus' label='Complementos' />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={getValueOfMainProductSelect(value)[1]} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {allMainProducts.lenght !== 0 && allMainProducts.map((mainProduct) => (
                                    <MenuItem
                                        key={`${mainProduct._id}-${mainProduct.title}`}
                                        value={`${mainProduct._id}-${mainProduct.title}`}
                                    >
                                        {mainProduct.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
                        <FormControl>
                            <TextField
                                label='Precio (opcional)'
                                placeholder='400'
                                value={categoryData.price}
                                onChange={e => setCategoryData({ ...categoryData, price: e.target.value })}
                            />
                        </FormControl>
                    </Grid>
                    <br />
                    <FormControl>
                        <Button
                            type='submit'
                            variant='contained'
                            className='btn-submit'
                        >
                            Crear
                        </Button>
                    </FormControl>
                </Grid>
            </form>
        </Box >
    )
}

export default AddEditCategory
