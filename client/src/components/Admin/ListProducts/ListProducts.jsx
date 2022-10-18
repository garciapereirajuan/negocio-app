import React, { useEffect, useState } from 'react'
import { Grid, List, ListItem, IconButton, Button, Avatar, ListItemText, ListItemAvatar, FormControlLabel, Checkbox } from '@mui/material'
import DragSortableList from 'react-drag-sortable'
import { products } from '../../../utils/productsArray';
import { showMainProductImageApi } from '../../../api/mainProduct'
import NoImage from '../../../assets/img/png/NoImage.png'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit';

import './ListProducts.css'

const ListProducts = ({ allMainProducts, setReloadAllProducts }) => {
    const [itemsMainProducts, setItemsMainProducts] = useState([])
    const [itemsBonusProducts, setItemsBonusProducts] = useState([])
    const [itemsCategories, setItemsCategories] = useState([])

    useEffect(() => {
        const itemsArray = []

        allMainProducts && allMainProducts.forEach(item => {
            itemsArray.push({
                content: <Item product={item} />
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
    }, [allMainProducts])

    const addProduct = () => {

    }

    const onSort = () => {

    }

    return (
        <Grid item container xs={12} justifyContent='space-between'>
            <Grid item xs={1.8} justifyContent='center'>
                <h3>Categorías</h3>
                <List>
                    <DragSortableList items={itemsCategories} onSort={onSort} dropBackTransitionDuration={0.3} type="vertical" />
                </List>
            </Grid>
            <Grid item xs={10} justifyContent='center'>
                <h3>Productos</h3>
                <List>
                    <DragSortableList items={itemsMainProducts} onSort={onSort} dropBackTransitionDuration={0.3} type="vertical" />
                </List>
            </Grid>
            {/* <Grid item xs={1.8} justifyContent='center'>
                <h3>Complementos</h3>
                <List>
                    <DragSortableList items={itemsBonusProducts} onSort={onSort} dropBackTransitionDuration={0.3} type="vertical" />
                </List>
            </Grid> */}
        </Grid>
    )
}

const Item = ({ product }) => {
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
                    <IconButton edge="start" className='edit-icon' aria-label="edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" className='delete-icon' aria-label="delete">
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
        </ListItem>
    )
}

export default ListProducts
