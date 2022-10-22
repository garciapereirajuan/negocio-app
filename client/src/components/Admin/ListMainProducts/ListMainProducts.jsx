import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, List, ListItem, IconButton, Button, Avatar, ListItemText, ListItemAvatar, Alert, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import DragSortableList from 'react-drag-sortable'
import { showMainProductImageApi, removeMainProductApi, updateMainProductCheckboxApi } from '../../../api/mainProduct'
import { getAccessTokenApi } from '../../../api/auth'
import ModalMui from '../../ModalMui'
import DialogMui from '../../DialogMui'
import AddEditProduct from '../AddEditProduct'

import NoImage from '../../../assets/img/png/NoImage.png'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit';

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

    useEffect(() => {
        const messageAboutSymbol = localStorage.getItem('messageAboutSymbol')

        if (!messageAboutSymbol) {
            setAlert(['warning', 'Antes de continuar quiero pedirte un favor. No uses aún el símbolo "&" en nada de lo que escribas porque puede ocurrir un error inesperado y todavía no está solucionado. No vas a volver a ver este mensaje, por lo que quiero que lo recuerdes. :)'])
        }

        return () => localStorage.setItem('messageAboutSymbol', true)
    }, [])

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
                    onClick={cancelDelete}
                >
                    Cancelar
                </Button>
                <Button
                    style={{ color: 'red' }}
                    onClick={confirmDelete}
                >
                    Eliminar
                </Button>
            </>
        )
    }

    const updateForCheckbox = (product, element) => {
        const token = getAccessTokenApi()

        updateMainProductCheckboxApi(token, product._id, element)
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
        console.log(sortedList)
    }

    return (
        <>



            {alert.length !== 0 && <Alert severity={alert[0]}>{alert[1]}</Alert>}
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
            <ListItemAvatar>
                <Avatar
                    src={imageUrl}
                    sx={{ width: 70, height: 70, marginRight: 2 }}
                >
                    {/* <FolderIcon /> */}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={<div className='title-div'>{product.title}{product.price > 0 && <span className='format-icon'>${product.price}</span>}</div>}
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
