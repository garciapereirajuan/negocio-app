import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import { 
    Card, CardHeader, CardMedia, CardContent, CardActions, 
    Collapse, Avatar, IconButton, Typography, Grid, Checkbox, 
    TextField, FormControl, FormGroup, FormControlLabel, Alert,
    Select, MenuItem
} from '@mui/material'
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import imgExample from '../../assets/img/jpg/papas-ketchup.jpg'
import accounting from 'accounting'
import NoImage from '../../assets/img/png/NoImage.png'
import { showMainProductImageApi } from '../../api/mainProduct'
import { v4 as uuidv4 } from 'uuid'

import './Product.css'

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

export default function Product({ product, bonusProducts, bonusProductsOk, setTotal, setBasket }) {
    const { stock, title, price, rating, description } = product
    const [productData, setProductData] = useState({})
    const [bonusProductData, setBonusProductData] = useState({})
    const [expanded, setExpanded] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)
    const [alert, setAlert] = useState([])
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
            ...product,
            quantity: 1,
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
        if (!stock) {
            const seconds = 5000
            setProductData(obj => ({ ...obj, alert: true }))
            setAlert(['error', `${productData.title} no está disponible`, productData.title])
            setTimeout(() => {
                setProductData(obj => ({ ...obj, alert: false}))
            }, seconds)

            return
        }

        const data = {
            ...productData, 
            bonusProductsOk: bonusProductData,
            id: uuidv4(),
        }
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

        let totalOfProduct = (productData.price * productData.quantity)
        setTotal(total => (
            Number.parseInt(total) + totalOfProduct)
        )

        data.quantity = 1
        data.alert = true
        data.bonusProductsOk = {}

        setProductData({...data})
        setBonusProductData({})
        setAlert(['success', `Producto agregado: $${totalOfProduct} +`, data.title])
        setTimeout(() => setProductData(obj => ({ ...obj, alert: false})), 5000)
    }

    const configNumber = (n) => {
        if (n > 0 && n <= 150) {
            return Number.parseInt(n)
        }

        if (n > 150) {
            return 150
        }

        return 0.5
    }

    const getItemsQuantity = () => {
        const arrayItemsQuantity = []

        if (productData.allowHalf) {
            arrayItemsQuantity.push(0.5)
        }

        for (let i = 1; i <= 8; i++) {
            arrayItemsQuantity.push(i)
        }

        // for (let i = .5; i < 4.5; i = i + .5) {
        //     let num = Number.parseInt(i)
        //     let decimal = i - Math.floor(i) ? '1/2' : ''

        //     if (i === .5) {
        //         num = '1/2'
        //         decimal = ''
        //     }

        //     arrayItemsDozen.push(
        //         <MenuItem>
        //             <div>
        //                 {num}<sup>{decimal}</sup> Docena{num > 1 && 's'}
        //             </div>
        //         </MenuItem>
        //     )
        // }

        return arrayItemsQuantity
    }

    const getPrice = (price) => {
        let currentPrice = 0

        currentPrice = productData.quantity * price

        return currentPrice
    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className='product'>
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
                    subheader={
                        stock
                            ? <span className='text-stock'>Disponible</span>
                            : <span className='text-no-stock'>No disponible</span>
                    }
                />
                <CardMedia
                    component="img"
                    height="194"
                    image={imageUrl}
                    alt="Paella dish"
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        <span title={description}>{description}</span>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'}}>
                        {productData.quantity === 0.5 ? '1/2' : productData.quantity}
                        <DoubleArrowIcon fontSize='20px'/>
                        {
                            <span className='text-price'>
                            {
                                price > 0
                                    ? accounting.formatMoney(getPrice(price), '$')
                                    : 'Gratis'
                            }
                            </span>
                        }
                        </div>
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
                        arial-label="add to cart" 
                        className='icon-shopping-cart'
                        onClick={addProduct}
                    >
                        <AddShoppingCart />
                    </IconButton>
                    <FormControl>
                        <div style={{display: 'flex', alignItems: "center"}}>
                            <Select
                                value={Number.parseFloat(productData.quantity)}
                                onChange={(e) => setProductData({ ...productData, quantity: e.target.value })}
                            >
                            {
                                getItemsQuantity().map(item => {
                                    if (item == 0.5) {
                                        return <MenuItem value={item}>1/2</MenuItem>
                                    }

                                    return <MenuItem value={item}>{item}</MenuItem>
                                })
                            }
                            </Select>
                            {/* <TextField
                                type='text'
                                inputMode='numeric'
                                pattern='\d*'
                                value={"2"}
                                
                            />*/}
                            {
                                productData.dozen
                                && (
                                    <Typography color='white' style={{marginLeft: '6px'}}>
                                        Docena{productData.quantity > 1 && 's'}
                                    </Typography>
                                )
                            }
                        </div>
                    </FormControl>
                 <FormControl>
                        
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
                        {
                            (bonusProducts && bonusProducts.length !== 0)
                            && (
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
                                                        onChange={e => setBonusProductData({ ...bonusProductData, [`${item.option} ${item.title}`]: e.target.checked })}
                                                    />
                                                    </>
                                                ))
                                            }
                                            </FormGroup>
                                        </FormControl>        
                                    </form>
                                </div>
                            )
                        }
                    </CardContent>
                </Collapse>
            </Card>
            {
                (alert[2] === productData.title 
                    && productData.alert) &&

                <Alert severity={alert[0]}>{alert[1]}</Alert>
            }
        </Grid>
    );
}
