import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import {
    Box, FormControl, TextField, Button,
    Typography, Alert, InputLabel, Select,
    OutlinedInput, Chip, MenuItem, FormControlLabel,
    FormGroup, Checkbox, Avatar, Grid,
} from '@mui/material'

import ModalMui from '../../ModalMui'
import { getAccessTokenApi } from '../../../api/auth'
import { addMainProductApi, addMainProductImageApi, updateMainProductApi } from '../../../api/mainProduct'
import { showBonusProductApi } from '../../../api/bonusProduct'
import { useDropzone } from 'react-dropzone'
import NoImage from '../../../assets/img/png/NoImage.png'

import '../../../css/AddEditForm.css'

// const allBonusProducts = [
//     {
//         title: 'Sal',
//         description: 'Sal',
//         image: false,
//         price: 0,
//         visible: true,
//         stock: true
//     },
//     {
//         title: 'Mayonesa',
//         description: 'Mayonesa',
//         image: false,
//         price: 0,
//         visible: true,
//         stock: true
//     }
// ]

const AddEditProduct = () => {
    const [openModal, setOpenModal] = useState(true)
    const [mainProductData, setMainProductData] = useState({})
    const [allBonusProducts, setAllBonusProducts] = useState([])
    const [preloadBonusProducts, setPreloadBonusProducts] = useState([])
    const [alert, setAlert] = useState([])
    const [image, setImage] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        showBonusProductApi().then(response => setAllBonusProducts(response.bonusProducts))
    }, [])

    useEffect(() => {
        setMainProductData({
            visible: true,
            stock: true,
            price: 0
        })

        if (location.search) {
            const query = queryString.parse(location.search)
            const data = JSON.parse(query.data)
            const objData = JSON.parse(data) //tengo que parsearlo otra vez

            if (!objData) {
                return
            }

            setMainProductData(objData)

            if (objData.imageUrl) {
                if (/data:image/.test(objData.imageUrl))
                    setImage(null)
                else setImage(objData.imageUrl)
            }

            if (objData?.bonusProducts.length === 0) {
                return 
            }

            const arrayPreloadBonusProducts = []

            objData.bonusProducts.forEach(item => {
                allBonusProducts && allBonusProducts.forEach(itemWithData => {
                    if (itemWithData._id === item) {
                        arrayPreloadBonusProducts.push(`${item}-${itemWithData.option}-${itemWithData.title}`)
                    }
                })
            })

            setPreloadBonusProducts(arrayPreloadBonusProducts)
        }
    }, [location, allBonusProducts])

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

    const addProduct = (e) => {
        e.preventDefault()
        const token = getAccessTokenApi()

        const { title, description } = mainProductData

        if (!title || !description) {
            setAlert(['error', 'El nombre y la descripción del producto son obligatorios.'])
            return
        }

        const data = {
            ...mainProductData,
            price: parseInt(mainProductData.price),
            order: 1000,
        }

        if (!image || typeof (image) === 'string') {
            addMainProductApi(token, data)
                .then(response => {
                    if (response?.code !== 200) {
                        setAlert(['error', response.message])
                        return
                    }
                    if (response?.code === 200) {
                        setAlert(['success', 'Producto agregado correctamente. Recuerda agregarle una imagen.'])
                        setOpenModal(false)
                        return
                    }
                    setAlert(['error', 'Ocurrió un error, intenta más tarde.'])
                })
                .catch(err => {
                    setAlert(['error', 'Ocurrió un error, intenta más tarde.'])
                })
            return
        }

        addMainProductApi(token, data)
            .then(response => {
                if (response?.code !== 200) {
                    setAlert(['error', response.message])
                    return
                }
                if (response?.code === 200) {
                    addMainProductImageApi(token, response.mainProductId, image.file)
                        .then(response => {
                            if (response?.code !== 200) {
                                setAlert(['error', response.message])
                                return
                            }
                            if (response?.code === 200) {
                                setAlert(['success', 'Producto subido correctamente.'])
                                setOpenModal(false)
                            }
                        })
                        .catch(err => {
                            setAlert(['error', 'Ocurrió un error, intenta más tarde.'])
                        })
                }
            })
            .catch(err => {
                setAlert(['error', 'Ocurrió un error, intent más tarde.'])
            })
    }

    const editProduct = (e) => {
        e.preventDefault()
        const token = getAccessTokenApi()

        const { title, description } = mainProductData
        const mainProductId = mainProductData._id

        if (!title || !description) {
            setAlert(['error', 'El nombre y la descripción del producto son obligatorios.'])
            return
        }

        const data = {
            ...mainProductData,
            price: parseInt(mainProductData.price)
        }

        if (!image || typeof (image) === 'string') {
            updateMainProductApi(token, mainProductId, data)
                .then(response => {
                    if (response?.code !== 200) {
                        setAlert(['error', response.message])
                        return
                    }
                    if (response?.code === 200) {
                        setAlert(['success', 'Producto actualizado correctamente.'])
                        setOpenModal(false)
                        return
                    }
                    setAlert(['error', 'Ocurrió un error, intenta más tarde.'])
                })
                .catch(err => {
                    setAlert(['error', 'Ocurrió un error, intenta más tarde.'])
                })
            return
        }

        updateMainProductApi(token, mainProductId, data)
            .then(response => {
                if (response?.code !== 200) {
                    setAlert(['error', response.message])
                    return
                }
                if (response?.code === 200) {
                    addMainProductImageApi(token, mainProductId, image.file)
                        .then(response => {
                            if (response?.code !== 200) {
                                setAlert(['error', response.message])
                                return
                            }
                            if (response?.code === 200) {
                                setAlert(['success', 'Producto actualizado correctamente.'])
                                setOpenModal(false)
                            }
                        })
                        .catch(err => {
                            setAlert(['error', 'Ocurrió un error, intenta más tarde.'])
                        })
                }
            })
            .catch(err => {
                setAlert(['error', 'Ocurrió un error, intent más tarde.'])
            })
    }

    if (Object.keys(mainProductData).length === 0) {
        return
    }

    return (
        <ModalMui
            openModal={openModal}
            setOpenModal={setOpenModal}
            contentModal={
                <FormProduct
                    setOpenModal={setOpenModal}
                    mainProductData={mainProductData}
                    setMainProductData={setMainProductData}
                    allBonusProducts={allBonusProducts}
                    preloadBonusProducts={preloadBonusProducts}
                    addProduct={addProduct}
                    editProduct={editProduct}
                    alert={alert}
                    setAlert={setAlert}
                    image={image}
                    setImage={setImage}
                />
            }
        />
    )
}

const FormProduct = ({ setOpenModal, setMainProductData, allBonusProducts, preloadBonusProducts, addProduct, editProduct, alert, setAlert, image, setImage, mainProductData}) => {
    const [bonusProductsSelect, setBonusProductsSelect] = useState([])
    const [checkObjectCategoryData, setCheckObjectCategoryData] = useState(false)

    useEffect(() => {
        if (!mainProductData.title) {
            setCheckObjectCategoryData(false)
            return
        } 

        setCheckObjectCategoryData(true)
    }, [])

    useEffect(() => {

        if (preloadBonusProducts.length !== 0) {
            setBonusProductsSelect(preloadBonusProducts)
        }

        console.log('preloadBonusProducts', preloadBonusProducts)
    }, [preloadBonusProducts])

    useEffect(() => {
        const bonusProductArray = []

        if (bonusProductsSelect.length === 0) {
            return
        }

        bonusProductsSelect.forEach(bonusProduct => {
            bonusProductArray.push(getValueOfBonusProductSelect(bonusProduct)[0])
        })

        setMainProductData({ ...mainProductData, bonusProducts: bonusProductArray })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bonusProductsSelect])

    const getValueOfBonusProductSelect = (key) => {
        const keys = key.split('-')
        const result = []

        result.push(keys[0])
        result.push(`${keys[1]} ${keys[2]}`)

        return result
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setBonusProductsSelect(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

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
                {!checkObjectCategoryData ? 'Nuevo ' : 'Editar '}producto
            </Typography>

            <UploadImage image={image} setImage={setImage} />
            {alert.length !== 0 && <Alert severity={alert[0]}>{alert[1]}</Alert>}
            <form
                className='add-edit-form__form'
                onSubmit={!checkObjectCategoryData ? addProduct : editProduct}
                onChange={() => setAlert([])}
            >
                <Grid container className='add-edit-form__form__box'>
                    <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
                        <FormControl>
                            <TextField
                                label='Nombre'
                                placeholder='Milanesa a la napolitana'
                                value={mainProductData.title}
                                onChange={e => setMainProductData({ ...mainProductData, title: verifText(e.target.value) })}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
                        <FormControl>
                            <TextField
                                label='Descripción'
                                placeholder='Milanesa con jamón, queso y salsa de tomate'
                                value={mainProductData.description}
                                onChange={e => setMainProductData({ ...mainProductData, description: verifText(e.target.value) })}
                            />
                        </FormControl>
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
                        <FormControl>
                            <InputLabel id='label-bonus'>Opciones para el cliente</InputLabel>
                            <Select
                                labelId='label-bonus'
                                id='multiple-bonus'
                                multiple
                                value={bonusProductsSelect}
                                onChange={handleChange}
                                input={<OutlinedInput id='select-multiple-bonus' label='Complementos' />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={getValueOfBonusProductSelect(value)[1]} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {allBonusProducts && allBonusProducts.map((item) => (
                                    <MenuItem
                                        key={`${item._id}-${item.option}-${item.title}`}
                                        value={`${item._id}-${item.option}-${item.title}`}
                                    >
                                        {`${item.option} ${item.title}`}
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
                                value={mainProductData.price > 0 ? mainProductData.price : undefined}
                                type='number'
                                onChange={e => setMainProductData({ ...mainProductData, price: e.target.value })}
                            />
                        </FormControl>
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={12} md={5.8} lg={5.8} >
                        <FormControl>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox defaultChecked />}
                                    label="Visible"
                                    checked={mainProductData.visible}
                                    onChange={(e) => setMainProductData({ ...mainProductData, visible: e.target.checked })}
                                />
                                <FormControlLabel
                                    control={<Checkbox defaultChecked />}
                                    label="Hay stock"
                                    checked={mainProductData.stock}
                                    onChange={(e) => setMainProductData({ ...mainProductData, stock: e.target.checked })}
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <FormControl>
                        <Button
                            type='submit'
                            variant='contained'
                            className='btn-submit'
                        >
                            {checkObjectCategoryData ? 'Guardar' : 'Crear'}
                        </Button>
                    </FormControl>
                </Grid>
            </form>
        </Box >
    )
}

const UploadImage = ({ image, setImage }) => {
    const onDrop = useCallback(
        acceptedFiles => {
            const file = acceptedFiles[0]

            if (/png|jpg|jpeg/.test(file.type)) {
                setImage({ file, preview: URL.createObjectURL(file) })
            }
        }, [setImage]
    )
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        noKeyboard: true,
        onDrop
    })

    return (
        <div className='upload-image' {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive
                    ? <Avatar src={NoImage} />
                    : <Avatar src={
                        image
                            ? typeof (image) === 'string' ? image : image.preview
                            : NoImage
                    } />
            }
        </div>
    )
}

const verifText = (text) => {
    if (text.length > 1) {
        return text
    }

    if (/[" "]+/g.test(text)) {
        return ''
    }
}

export default AddEditProduct
