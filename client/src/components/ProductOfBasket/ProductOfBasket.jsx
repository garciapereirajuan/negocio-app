import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import { 
    Card, CardHeader, CardMedia, CardContent, CardActions, 
    Collapse, Avatar, IconButton, Typography, Grid, Checkbox, 
    TextField, FormControl, FormGroup, FormControlLabel
} from '@mui/material'
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import imgExample from '../../assets/img/jpg/papas-ketchup.jpg'
import accounting from 'accounting'
import NoImage from '../../assets/img/png/NoImage.png'
import { showMainProductImageApi } from '../../api/mainProduct'

import './ProductOfBasket.css'

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function ProductOfBasket({ product, bonusProducts, bonusProductsOk, setTotal, setBasket, reloadBasket, reloadTotal, setReloadBasket, setReloadTotal }) {
    const { stock, title, price, rating, description } = product
    const [productData, setProductData] = useState({})
    const [bonusProductData, setBonusProductData] = useState({})
    const [expanded, setExpanded] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!bonusProductsOk) {
            const bonusProductsObj = {}

            bonusProducts && bonusProducts.forEach(item => {
                bonusProductsObj[`${item.option} ${item.title}`] = false
            })

            setBonusProductData(bonusProductsObj)
            return
        }

        setBonusProductData(bonusProductsOk)
    }, [])

    useEffect(() => {
        setProductData({
            ...product
        })
    }, [])

    useEffect(() => {
        if (!product.image) {
            setImageUrl(NoImage)
            return
        }

        showMainProductImageApi(product.image)
            .then(response => {

                setImageUrl(response)
            })
            .catch(err => console.log('Error al cargar la imagen', err))
    }, [product])

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };  

    const addProduct = () => {
        const data = {...productData, bonusProductsOk: bonusProductData}
        let basketStorage = localStorage.getItem('basket')

        if (basketStorage) {
            basketStorage = JSON.parse(basketStorage)
        }

        if (!basketStorage) {
            basketStorage = []
        }

        basketStorage.push(data)
        localStorage.setItem('basket', JSON.stringify(basketStorage))
        localStorage.setItem('basketLength', basketStorage.length)

        navigate(`/products?basket=${basketStorage.length}`)
        //esto está sólo para que NavBar reconozca el cambio 
        //y modifique el número del carrito gracias a volver
        //a renderizar el useEffect con location y cambiar el número

        setTotal(total => (
            Number.parseInt(total) + (productData.price * productData.quantity))
        )
    }

    const updateProduct = (data, bonusProductData) => {
        if (reloadBasket || reloadTotal) {
            return
        }

        if (bonusProductData) {
            data.bonusProductsOk = bonusProductData
        }

        let basketStorage = localStorage.getItem('basket')
        let totalStorage = localStorage.getItem('total')

        basketStorage = JSON.parse(basketStorage)
        totalStorage = Number.parseInt(totalStorage)

        let index = null
        let price = 0
        let quantity = 0

        basketStorage.forEach((item, i) => {
            if (item.id === data.id) {
                index = i
                price = item.price
                quantity = item.quantity
            }
        })

        totalStorage = totalStorage - (price * quantity)

        if (index || index === 0) {
            basketStorage[index] = data
            quantity = data.quantity
            price = data.price

            totalStorage = totalStorage + (price * quantity)

            localStorage.setItem('basket', JSON.stringify(basketStorage))
            localStorage.setItem('total', totalStorage)
            setBasket(basketStorage)
            setProductData(data)
            setReloadTotal(true)
            setReloadBasket(true)
        }
    }

    const removeProduct = (productId) => {
        if (reloadBasket || reloadTotal) {
            return
        }

        let basketStorage = localStorage.getItem('basket')
        let totalStorage = localStorage.getItem('total')

        basketStorage = JSON.parse(basketStorage)
        totalStorage = Number.parseInt(totalStorage)

        let index = null
        let price = 0
        let quantity = 0

        basketStorage.forEach((item, i) => {
            if (item.id === productId) {
                index = i
                price = item.price
                quantity = item.quantity
            }
        })

        if (index || index === 0) {
            basketStorage[index] = null
        }

        basketStorage = basketStorage.filter(Boolean)
        totalStorage = totalStorage - (price * quantity)

        localStorage.setItem('basket', JSON.stringify(basketStorage))
        localStorage.setItem('total', totalStorage)
        localStorage.setItem('basketLength', basketStorage.length)

        navigate(`/shopping-cart?basket=${basketStorage.length}`)

        setBasket(basketStorage)
        setReloadTotal(true)
        setReloadBasket(true)
    }

    const configNumber = (n) => {
        if (n > 0 && n <= 150) {
            return Number.parseInt(n)
        }

        if (n > 150) {
            return 150
        }

        return 1
    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className='product-of-basket'>
                <CardHeader
                    // avatar={
                    //     <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    //         R
                    //     </Avatar>
                    // }
                    // action={
                    //     <Typography
                    //         variant='h5'
                    //         color='textSecondary'
                    //     >
                    //         {accounting.formatMoney(price, '$')}
                    //     </Typography>
                    // }
                    title={title}
                />
                <CardMedia
                    component="img"
                    height="194"
                    image={imageUrl}
                    alt="Paella dish"
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    {/* {
                    Array(rating)
                    .fill()
                    .map(() => (<p>&#11088;</p>))
                } */}
                    {/* <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton> */}
                    <IconButton 
                        arial-label="remove to cart" 
                        className='icon-delete-cart'
                        onClick={() => removeProduct(productData.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                    <FormControl>
                        <TextField 
                            type='number' 
                            value={productData.quantity}
                            onChange={(e) => {
                                updateProduct({ ...productData, quantity: configNumber(e.target.value) })
                            }}
                        />
                    </FormControl>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography>
                            {description}
                        </Typography>
                        <div className='checkbox-collapse'>
                            <form>
                                <FormControl>
                                    <FormGroup>
                                    {
                                        bonusProducts.map(item => (
                                            <>
                                            <FormControlLabel 
                                                control={<Checkbox />}
                                                label={
                                                    <div style={{display: 'flex'}}>
                                                        <div 
                                                            className='title-capitalize' 
                                                            style={{marginRight: '4px'}}
                                                        >
                                                            {item.option}
                                                        </div>
                                                        {item.title}
                                                    </div>
                                                }
                                                checked={bonusProductData[`${item.option} ${item.title}`]}
                                                onChange={e => {
                                                    setBonusProductData({ ...bonusProductData, [`${item.option} ${item.title}`]: e.target.checked })
                                                    updateProduct(productData, { ...bonusProductData, [`${item.option} ${item.title}`]: e.target.checked })
                                                }}
                                            />
                                            </>
                                        ))
                                    }
                                    </FormGroup>
                                </FormControl>        
                            </form>
                        </div>
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    );
}
