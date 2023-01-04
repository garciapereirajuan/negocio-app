import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { 
    Card, CardHeader, CardMedia, CardContent, CardActions, 
    IconButton, Typography, Grid, Checkbox, 
    FormControl, FormGroup, FormControlLabel, Alert,
    Select, MenuItem, Collapse, Fade
} from '@mui/material'

import LoadingButton from "@mui/lab/LoadingButton"
import { v4 as uuidv4 } from 'uuid'
import accounting from 'accounting'
import { styled } from '@mui/material/styles';
import MenuBonusProducts from '../MenuBonusProducts'
import { showMainProductImageApi } from '../../api/mainProduct'
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import CloseIcon from '@mui/icons-material/Close';
import NoImage from '../../assets/img/png/NoImage.png'
import getImage from "../../utils/getImage"

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

export default function Product({ product, bonusProducts, bonusProductsOk, setTotal, total, setBasket }) {
    let { stock, title, price, rating, description, image } = product
    const [priceProduct, setPriceProduct] = useState(0)
    const [productData, setProductData] = useState({})
    const [bonusProductData, setBonusProductData] = useState({})
    const [expanded, setExpanded] = useState(false)
    const [labelImage, setLabelImage] = useState('')
    const [evalBonusPrice, setEvalBonusPrice] = useState({})
    const [classRotate, setClassRotate] = useState(false)
    const [loadingButton, setLoadingButton] = useState(false)
    const [alert, setAlert] = useState([])

    // NECESARIO PARA LA RUTA DE LA IMAGEN
    // const [imageUrl, setImageUrl] = useState(null)

    const containerTextPrice = useRef()
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

    //NECESARIO PARA SABER LA RUTA DE LA IMAGEN
        // no necesario actualmente

    // useEffect(() => {
    //     if (!product.image) {
    //         setImageUrl(NoImage)
    //         return
    //     }

    //     showMainProductImageApi(product.image)
    //         .then(response => {
    //             setImageUrl(response)
    //         })
    //         .catch(err => console.log('Error al cargar la imagen', err))

    // }, [product])

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };  

    useEffect(() => {
        let currentPrice = 0
        let evalBonusPriceArray = []
        const quantity = productData.quantity
        containerTextPrice.current.classList.add("animation")
        setTimeout(() => containerTextPrice.current.classList.remove("animation"), 2000)

        currentPrice = 0
        
        if (Object.keys(evalBonusPrice).length !== 0) {
            
            for (const item in evalBonusPrice) {

                if (evalBonusPrice[item]) {
                    evalBonusPriceArray.push(item)
                }
            }

            evalBonusPriceArray = evalBonusPriceArray.join('')
            currentPrice = eval(`${price}${evalBonusPriceArray}`)
            currentPrice = quantity * currentPrice
        } else {
            currentPrice = quantity * price
        }

        setPriceProduct(currentPrice)
    }, [productData.quantity, evalBonusPrice])

    useEffect(() => {
        if (alert.length !== 0 && loadingButton) {
            setLoadingButton(false)
        }
    }, [alert])

    const addProduct = () => {
        if (!stock) {
            setAlert(['error', `${productData.title} no está disponible`, productData.title])
            return
        }

        const data = {
            ...productData, 
            bonusProductsOk: bonusProductData,
            evalBonusPriceOk: evalBonusPrice,
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

        let totalOfProduct = priceProduct
        let totalOfBasket =  Number.parseInt(total) + totalOfProduct

        localStorage.setItem('total', totalOfBasket)

        setTotal(total => totalOfBasket)
        navigate(`/products?basket=${basketStorage.length}&total=${totalOfBasket}`)
        //esto está sólo para que NavBar reconozca el cambio 
        //y modifique el número del carrito gracias a volver
        //a renderizar el useEffect con location y cambiar el número

        data.quantity = 1
        data.alert = true
        data.bonusProductsOk = {}

        setAlert(['success', `+ $${totalOfProduct}`, data.title])

        setProductData({...data})
        setBonusProductData({})
        setEvalBonusPrice([])
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
        return arrayItemsQuantity
    }

    const getPrice = () => {
        let currentPrice = 0
        let evalBonusPriceArray = []

        currentPrice = productData.quantity * price

        if (Object.keys(evalBonusPrice).length !== 0) {
            
            for (const item in evalBonusPrice) {
                if (evalBonusPrice[item]) {
                    evalBonusPriceArray.push(item)
                }
            }

            evalBonusPriceArray = evalBonusPriceArray.join('')

            currentPrice = eval(`${currentPrice}${evalBonusPriceArray}`)
        }

        setPriceProduct(currentPrice)
    }

    let labelImageLet = ''

    const ifParenthesis = (title) => {
        if (/\([\s\S]+\)/g.test(title)) {
            let onlyText = title.match(/\([\s\S]+\)/g)[0]
            onlyText = onlyText.replace('(', '')
            onlyText = onlyText.replace(')', '')
            labelImageLet = onlyText
            return title
        }

        labelImageLet = ''
        return title
    }

    const handleClassRotateClick = () => {
        if (classRotate) {
            setClassRotate('')
            return
        }
        setClassRotate('rotate')
    }

    return (
        <>
            <Fade in={image}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card className='product'>
                        <CardHeader
                            title={ifParenthesis(title)}
                            subheader={
                                stock
                                    ? <span className='text-stock'>Disponible</span>
                                    : <span className='text-no-stock'>No disponible</span>
                            }
                        />
                        <div className="container-image">

                            {/*
                                Las rutas de las imágenes
                                están en un archivo estático
                                (esto no es así en producción real)
                            */}
                            <CardMedia
                                component="img"
                                height="194"
                                // image={imageUrl}
                                image={getImage[image]}
                                alt={"Cargando imagen: "+title}
                            />
                        </div>
                        {labelImageLet && <div className='label-image'>{labelImageLet}</div>}
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                <span title={description}>{description}</span>
                                <div className="container-text-price" ref={containerTextPrice}>
                                    {productData.quantity === 0.5 ? '1/2' : productData.quantity}
                                    <DoubleArrowIcon fontSize='20px'/>
                                    {
                                        <span className='text-price'>
                                        {
                                            price > 0
                                                ? accounting.formatMoney(priceProduct, '$')
                                                : 'Gratis'
                                        }
                                        </span>
                                    }
                                </div>
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <LoadingButton 
                                arial-label="add to cart" 
                                className='icon-shopping-cart'
                                loading={loadingButton}
                                variant="outlined"
                                onClick={() => {
                                    setLoadingButton(true);
                                    setTimeout(() => {
                                        addProduct(); 
                                        setExpanded(false);                                
                                    }, 100)
                                }}
                            >
                                <Fade in={!loadingButton}><AddShoppingCart /></Fade>
                            </LoadingButton>
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
                                className='expand-more-element'
                                aria-label="show more"
                            >
                                <div className='content-expand-more'>
                                    <MenuBonusProducts
                                        typeProduct={0}
                                        bonusProducts={bonusProducts} 
                                        bonusProductData={bonusProductData} 
                                        setBonusProductData={setBonusProductData} 
                                        setEvalBonusPrice={setEvalBonusPrice} 
                                    />
                                </div>
                            </ExpandMore>
                        </CardActions>
                    </Card>
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
                </Grid>
            </Fade>
        </>
    );
}
