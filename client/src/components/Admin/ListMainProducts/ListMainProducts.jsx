import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, List, ListItem, IconButton, Button, Avatar, ListItemText, ListItemAvatar, Alert, FormControl, FormGroup, FormControlLabel, Checkbox, Collapse } from '@mui/material'
import DragSortableList from 'react-drag-sortable'
import { showMainProductImageApi, removeMainProductApi, updateMainProductSpecialApi } from '../../../api/mainProduct'
import { getAccessTokenApi } from '../../../api/auth'
import ModalMui from '../../ModalMui'
import DialogMui from '../../DialogMui'
import exportStyleButtonDialog from '../../DialogMui/exportStyleButtonDialog'
import AddEditProduct from '../AddEditProduct'
import getImage from "../../../utils/getImage.js"

import NoImage from '../../../assets/img/png/NoImage.png'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import './ListMainProducts.css'

const ListMainProducts = ({ allMainProducts, setReloadAllMainProducts }) => {
    const [itemsMainProducts, setItemsMainProducts] = useState([])
    const [itemsBonusProducts, setItemsBonusProducts] = useState([])
    const [itemsCategories, setItemsCategories] = useState([])
    const [alert, setAlert] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [titleDialog, setTitleDialog] = useState('')
    const [contentDialog, setContentDialog] = useState(null)
    const [actionsDialog, setActionsDialog] = useState(null)
    const navigate = useNavigate()

    // useEffect(() => {
    //     const messageAboutSymbol = localStorage.getItem('messageAboutSymbol')

    //     if (!messageAboutSymbol) {
    //         setAlert(['warning', 'Por favor. Por el momento no uses el símbolo "&" en la información de ningún producto porque puede ocurrir un error inesperado.'])
    //     }

    //     return () => localStorage.setItem('messageAboutSymbol', true)
    // }, [])

    useEffect(() => {
        const itemsArray = []

        allMainProducts && allMainProducts.forEach(item => {
            itemsArray.push({
                content: (
                    <Item
                        product={item}
                        editProduct={editProduct}
                        deleteProduct={deleteProduct}
                        updateForCheckbox={updateForCheckbox}
                    />
                )
            })
        })

        setItemsMainProducts(itemsArray)

        setItemsCategories([
            { content: <Button style={{ width: '100%' }}>Pizzas</Button> },
            { content: <Button style={{ width: '100%' }}>Empanadas</Button> }
        ])

        setItemsBonusProducts([
            { content: <Item product={{ title: 'Sal', description: '', image: false, price: 0 }} /> }
        ])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allMainProducts])

    useEffect(() => {
        const messageAboutSymbol = localStorage.getItem('messageAboutSymbol')

        if (!messageAboutSymbol) {
            return
        }

        setTimeout(() => setAlert([]), 10000)
    }, [alert])

    const editProduct = (product, imageUrl) => {
        product.imageUrl = imageUrl
        const productData = JSON.stringify(product)

        navigate(`/admin/product?data=${JSON.stringify(productData)}`)
    }

    const deleteProduct = (product) => {
        const { styleButtonDialogConfirm, styleButtonDialogCancel } = exportStyleButtonDialog        
        const token = getAccessTokenApi()

        const cancelDelete = () => setOpenDialog(false)

        const confirmDelete = () => {
            removeMainProductApi(token, product._id)
                .then(response => {
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
            setReloadAllMainProducts(true)
        }

        setOpenDialog(true)
        setTitleDialog('Eliminando producto...')
        setContentDialog(
            <div>
                ¿Quieres eliminar el producto <strong>{product.title}</strong>?
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

    const updateForCheckbox = (product, element) => {
        const token = getAccessTokenApi()

        updateMainProductSpecialApi(token, product._id, element)
            .then(response => {
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
        setReloadAllMainProducts(true)
    }

    const onSort = (sortedList, dropEvent) => {
        const token = getAccessTokenApi()

        sortedList.forEach(item => {
            const order = item.rank
            const mainProductId = item.content.props.product._id

            updateMainProductSpecialApi(token, mainProductId, { order })
                .then(response => {
                    if (response?.code === 200) {
                        setReloadAllMainProducts(true)
                        // navigate('/admin/products')
                    } else {
                        console.log('Ocurrió un error', response)
                    }
                })
                .catch(err => console.log('Ocurrió un error', err))
            // console.log(item, mainProductId)
        })
    }

    return (
        <>
            <Collapse in={alert.length !== 0}>
                <Alert
                    action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setAlert([]);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                        sx={{ mb: 2 }}
                        severity={alert[0]}
                    >
                    {alert[1]}
                </Alert>
            </Collapse>
            <List>
                <DragSortableList items={itemsMainProducts} onSort={onSort} dropBackTransitionDuration={0.3} type="vertical" />
            </List>

            {/* <Grid item xs={1.8} justifyContent='center'>
                <h3>Complementos</h3>
                <List>
                    <DragSortableList items={itemsBonusProducts} onSort={onSort} dropBackTransitionDuration={0.3} type="vertical" />
                </List>
            </Grid> */}

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

const Item = ({ product, editProduct, deleteProduct, updateForCheckbox }) => {
const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        if (!product.image) {
            setImageUrl(NoImage)
            return
        }

        showMainProductImageApi(product.image)
            .then(response => setImageUrl(response))
    }, [product])

    return (
        <ListItem
            secondaryAction={
                <>
                    <IconButton
                        edge="start"
                        className='edit-icon'
                        aria-label="edit"
                        onClick={() => editProduct(product, imageUrl)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        edge="end"
                        className='delete-icon'
                        aria-label="delete"
                        onClick={() => deleteProduct(product)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >
            <ListItemAvatar className='main-product-avatar'>
                <Avatar
                    src={getImage[product.image]}
                    sx={{ width: 70, height: 70, marginRight: 2 }}
                    onClick={() => editProduct(product, imageUrl)}
                >
                    {/* <FolderIcon /> */}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <div 
                        className='title-div'
                    >
                        {product.title}
                        {
                            product.price > 0 && ( 
                                <span className='format-icon'>
                                    ${product.price}
                                </span>
                            )
                        }
                    </div>
                }
                secondary={product.description}
            />
            <div className='form-group-checkbox'>
                <div className='form-checkbox'>
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Visible"
                        checked={product.visible}
                        onChange={(e) => updateForCheckbox(product, { visible: e.target.checked })}
                    />
                </div>
                <div className='form-checkbox'>
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Hay stock"
                        checked={product.stock}
                        onChange={(e) => updateForCheckbox(product, { stock: e.target.checked })}
                    />
                </div>
            </div>
        </ListItem>
    )
}

export default ListMainProducts
