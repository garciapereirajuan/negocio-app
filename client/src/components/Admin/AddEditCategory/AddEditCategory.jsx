import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { Box, Typography, Grid, FormControl, TextField, Button, Alert, InputLabel, Select, OutlinedInput, MenuItem, Chip } from '@mui/material'
import DialogMui from '../../DialogMui'
import exportStyleButtonDialog from "../../DialogMui/exportStyleButtonDialog"
import { getAccessTokenApi } from '../../../api/auth'
import { showMainProductApi } from '../../../api/mainProduct'
import { addCategoryApi, updateCategoryApi, removeCategoryApi } from '../../../api/categories'
import ModalMui from '../../ModalMui'

import DeleteIcon from '@mui/icons-material/Delete'

import '../../../css/AddEditForm.css'

const AddEditCategory = () => {
    const [openModal, setOpenModal] = useState(null)
    const [allMainProducts, setAllMainProducts] = useState([])
    const [categoryData, setCategoryData] = useState([])
    const [preloadMainProductsSelect, setPreloadMainProductsSelect] = useState([])
    const [alert, setAlert] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [titleDialog, setTitleDialog] = useState('')
    const [contentDialog, setContentDialog] = useState(null)
    const [actionsDialog, setActionsDialog] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const arrayPreloadMainProducts = []

        if (location.search) {
            const query = queryString.parse(location.search)
            const objData = JSON.parse(query.data)
            // const objData = JSON.parse(data) //tengo que parsearlo otra vez

            setCategoryData(objData)

            if (objData?.mainProducts.length === 0) {
                return 
            }

            if (allMainProducts?.legnth !== 0) {
                objData.mainProducts.forEach(item => {
                    allMainProducts.forEach(itemWithData => {
                        if (itemWithData._id === item) {
                            arrayPreloadMainProducts.push(`${item}-${itemWithData.title}`)
                        }
                    })
                })

                setPreloadMainProductsSelect(arrayPreloadMainProducts)
            }    
        }

    }, [location, allMainProducts])

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
        const { title } = categoryData

        if (!title) {
            setAlert(['error', 'El título de la categoría es obligatorio.'])
            return
        }

        categoryData.order = 1000

        addCategoryApi(token, categoryData)
            .then(response => {
                if (response?.code !== 200) {
                    setAlert(['error', response.message])
                    return
                }
                if (!response || !response?.code) {
                    setAlert(['error', 'Ocurrió un error al crear la categoría, intenta más tarde.'])
                    return
                }

                setAlert(['success', response.message])
                setOpenModal(false)
            })
            .catch(err => {
                setAlert(['error', 'Ocurrió un error al crear la categoría, intenta más tarde.'])
            })
    }

    const editCategory = (e) => {
        e.preventDefault()
        const token = getAccessTokenApi()
        const { title, description, mainProducts, price, order } = categoryData

        if (!title) {
            setAlert(['error', 'El título de la categoría es obligatorio.'])
        }

        const data = { title, description, mainProducts, price, order }

        updateCategoryApi(token, categoryData._id, data)
            .then(response => {
                if (response?.code !== 200) {
                    setAlert(['error', response.message])
                    return
                }
                if (!response || !response?.code) {
                    setAlert(['error', 'Ocurrió un error al actualizar la categoría, intenta más tarde.'])
                    return
                }

                setAlert(['success', response.message])
                setOpenModal(false)
            })
            .catch(err => {
                setAlert(['error', 'Ocurrió un error al actualizar la categoría, intenta más tarde.'])
            })
    }

    const deleteCategory = (category) => {
        const { styleButtonDialogConfirm, styleButtonDialogCancel } = exportStyleButtonDialog
        alert(JSON.stringify(styleButtonDialogConfirm))
        const token = getAccessTokenApi()

        const cancelDelete = () => setOpenDialog(false)

        const confirmDelete = () => {

            removeCategoryApi(token, category._id)
                .then(response => {
                    alert(response)
                    if (response?.code !== 200) {
                        setAlert(['error', response.message])
                        return
                    }
                    if (response?.code === 200) {
                        setAlert(['success', response.message])
                        return
                    }
                    setAlert(['error', 'Ocurrió un error en el servidor, intenta más tarde.'])
                })
                .catch(err => {
                    setAlert(['error', 'Ocurrió un error en el servidor, intenta más tarde.'])
                })

            setOpenDialog(false)
            setOpenModal(false)
        }

        setOpenDialog(true)
        setTitleDialog('Eliminando categoría...')
        setContentDialog(
            <div>
                ¿Quieres eliminar la categoría <strong>{category.title}</strong>?
            </div>
        )
        setActionsDialog(
            <>
                <Button
                    style={styleButtonDialogCancel}
                    variant="contained"
                    onClick={cancelDelete}
                >
                    Cancelar
                </Button>
                <Button
                    style={styleButtonDialogConfirm}
                    variant="contained"
                    onClick={confirmDelete}
                >
                    Eliminar
                </Button>
            </>
        )
    }

    return (
        <>
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
                        editCategory={editCategory}
                        deleteCategory={deleteCategory}
                        preloadMainProductsSelect={preloadMainProductsSelect}
                        alert={alert}
                        setAlert={setAlert}
                    />
                }
            />
            <DialogMui
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                titleDialog={titleDialog}
                contentDialog={contentDialog}
                actionsDialog={actionsDialog}
            />
        </> 
    )
}

const FormCategory = ({ setOpenModal, allMainProducts, categoryData, setCategoryData, addCategory, editCategory, deleteCategory, preloadMainProductsSelect, alert, setAlert }) => {
    const [mainProductsSelect, setMainProductsSelect] = useState([])
    const [checkObjectCategoryData, setCheckObjectCategoryData] = useState(false)

    useEffect(() => {
        const checkObjectCategoryData = Object.keys(categoryData)

        if (checkObjectCategoryData.length === 0) {
            setCheckObjectCategoryData(false)
            return
        } 

        setCheckObjectCategoryData(true)
    }, [])

    useEffect(() => {
        if (preloadMainProductsSelect?.length !== 0) {
            setMainProductsSelect(preloadMainProductsSelect)
        }
    }, [preloadMainProductsSelect])

    useEffect(() => {
        const mainProductArray = []

        if (mainProductsSelect.length === 0) {
            return
        }

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
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '26px'
                }}
            >
            {
                checkObjectCategoryData
                    ? (
                        <span
                            className='format-icon'
                            style={{background: '#f00'}}
                            onClick={() => deleteCategory(categoryData)}
                        >
                            <DeleteIcon />
                        </span>
                    ) : (
                        <span>
                        </span>
                    )

            }
                
                <span
                    className='format-icon'
                    onClick={() => setOpenModal(false)}
                >
                    X
                </span>
            </Typography>
            <Typography variant='h5' color='#373737' textAlign='center'>
                {checkObjectCategoryData ? "Editar" : "Nueva"} categoría
            </Typography>
            {alert.length !== 0 && <Alert severity={alert[0]}>{alert[1]}</Alert>}
            <form
                className='add-edit-form__form'
                onSubmit={!checkObjectCategoryData ? addCategory : editCategory}
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
                                label='Descripción (opcional)'
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
                            {checkObjectCategoryData ? "Guardar" : "Crear"}
                        </Button>
                    </FormControl>
                </Grid>
            </form>
        </Box >
    )
}

export default AddEditCategory
