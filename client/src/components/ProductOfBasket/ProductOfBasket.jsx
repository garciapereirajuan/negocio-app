import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { 
    Card, CardHeader, CardMedia, CardContent, CardActions, 
    IconButton, Typography, Grid, FormControl, Select,
    MenuItem, Button
} from '@mui/material'
import accounting from 'accounting'
import { styled } from '@mui/material/styles';
import MenuBonusProducts from '../MenuBonusProducts'
import DialogMui from "../DialogMui"
import { styleButtonDialogConfirm, styleButtonDialogCancel } from "../DialogMui/exportStyleButtonDialog"
import getImage from "../../utils/getImage"

import DeleteIcon from '@mui/icons-material/Delete';
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
    const { stock, title, price, rating, description, image, evalBonusPriceOk } = product
    const [openDialog, setOpenDialog] = useState(false)
    const [titleDialog, setTitleDialog] = useState("")
    const [contentDialog, setContentDialog] = useState(null)
    const [actionsDialog, setActionsDialog] = useState(null)
    const [productData, setProductData] = useState({})
    const [bonusProductData, setBonusProductData] = useState({})
    const [evalBonusPrice, setEvalBonusPrice] = useState({})
    const [expanded, setExpanded] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)
    const navigate = useNavigate()

    // OLVIDÉ QUE EL 'PRODUCT' TRAE TODA LA INFO DEL PRODUCTO ACTUAL
    // EN UPDATEPRODUCT NO LO TENGO EN CUENTA
    // REFACTORIZAR....

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

    useEffect(() => {
        let keys = []

        keys = evalBonusPrice && Object.keys(evalBonusPrice)

        if (keys?.length !== 0) {
            return
        }

        setEvalBonusPrice(evalBonusPriceOk)
    }, [product])

    const existsThisObj = obj => obj && Object.keys(obj).length !== 0

    const getEvalBonusPriceArray = (objEvalBonusPrice) => {
        let evalBonusPriceArray = []

        if (!objEvalBonusPrice) {
            return ''
        }

        if (Object.keys(objEvalBonusPrice).length !== 0) {
            
            for (const item in objEvalBonusPrice) {
                if (objEvalBonusPrice[item]) {
                    evalBonusPriceArray.push(item)
                }
            }

            evalBonusPriceArray = evalBonusPriceArray.join('')

            return evalBonusPriceArray
        }

        return ''
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };  

    const updateProduct = (data, bonusProductsDataAux, evalBonusPriceAux) => {
        if (reloadBasket || reloadTotal) {
            return
        }

        if (bonusProductsDataAux) {
            data.bonusProductsOk = bonusProductsDataAux
            setBonusProductData(bonusProductsDataAux)  
        }

        let basketStorage = localStorage.getItem('basket')
        let totalStorage = localStorage.getItem('total')

        basketStorage = JSON.parse(basketStorage)
        totalStorage = Number.parseInt(totalStorage)

        let index = null
        let price = 0
        let priceNew = 0
        let quantity = 0
        let evalBonusPriceOld = {}
        let evalBonusPriceNew = {}
        
        //comparación del array de productos dentro de la canasta
        //extraigo el producto correspondiente
        basketStorage.forEach((item, i) => {
            if (item.id === data.id) {
                index = i
                price = item.price
                quantity = item.quantity
                evalBonusPriceOld = item.evalBonusPriceOk
            }
        })

        if (existsThisObj(evalBonusPriceAux)) {
            data.evalBonusPriceOk = evalBonusPriceAux
        } else {
            data.evalBonusPriceOk = evalBonusPriceOld
            evalBonusPriceAux = evalBonusPriceOld
        }

        evalBonusPriceOld = getEvalBonusPriceArray(evalBonusPriceOld)
        evalBonusPriceNew = getEvalBonusPriceArray(evalBonusPriceAux)

        //al precio le resto el elemento completo, como si no existiera
        //para luego agregarlo más abajo con la nueva data

        priceNew = eval(`${price}${evalBonusPriceOld}`)

        totalStorage = totalStorage - (priceNew * quantity)   

        //le aplico la nueva data al producto correspondiente
        if (index || index === 0) {
            basketStorage[index] = data
            quantity = data.quantity
            price = data.price

            priceNew = eval(`${price}${evalBonusPriceNew}`)

            totalStorage = totalStorage + (priceNew * quantity)

            localStorage.setItem('basket', JSON.stringify(basketStorage))
            localStorage.setItem('total', totalStorage)
            setEvalBonusPrice(evalBonusPriceAux)
            setBasket(basketStorage)
            setProductData(data)
            setReloadTotal(true)
            setReloadBasket(true)

            navigate(`/shopping-cart?total=${totalStorage}`)
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
        let priceFull = 0
        let quantity = 0
        let evalBonusPriceAux = {}

        basketStorage.forEach((item, i) => {
            if (item.id === productId) {
                index = i
                price = item.price
                quantity = item.quantity
                evalBonusPriceAux = item.evalBonusPriceOk
            }
        })

        evalBonusPriceAux = getEvalBonusPriceArray(evalBonusPriceAux)

        if (index || index === 0) {
            basketStorage[index] = null
        }

        basketStorage = basketStorage.filter(Boolean)

        priceFull = eval(`${price}${evalBonusPriceAux}`)
        totalStorage = totalStorage - (priceFull * quantity)

        localStorage.setItem('basket', JSON.stringify(basketStorage))
        localStorage.setItem('total', totalStorage)
        localStorage.setItem('basketLength', basketStorage.length)

        navigate(`/shopping-cart?basket=${basketStorage.length}`)

        setBasket(basketStorage)
        setReloadTotal(true)
        setReloadBasket(true)
    }

    const confirmRemove = (productId) => {
        setOpenDialog(true)
        setTitleDialog("Eliminando el producto...")
        setContentDialog(
            <div>¿Querés eliminar este producto del carrito?</div>
        )
        setActionsDialog(
            <>
                <Button
                    style={styleButtonDialogCancel}
                    variant="contained"
                    onClick={() => setOpenDialog(false)}
                >
                    Cancelar
                </Button>
                <Button
                    style={styleButtonDialogConfirm}
                    variant="contained"
                    onClick={() => removeProduct(productId)}
                >
                    Eliminar
                </Button>
            </>
        )
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

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <DialogMui 
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                titleDialog={titleDialog}
                contentDialog={contentDialog}
                actionsDialog={actionsDialog}
            />
            <Card className='product-of-basket'>
                <CardHeader
                    title={title}
                />
                <div className="container-image">
                    <CardMedia
                        component="img"
                        height="194"
                        image={getImage[image]}
                        alt={title}
                    />
                </div>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton 
                        arial-label="remove to cart" 
                        className='icon-delete-cart'
                        onClick={() => confirmRemove(productData.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                    <FormControl>
                        <div style={{display: 'flex', alignItems: "center"}}>
                            <Select
                                value={Number.parseFloat(productData.quantity)}
                                onChange={(e) => updateProduct({ ...productData, quantity: e.target.value })}
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
                    <ExpandMore
                        aria-label="show more"
                        className='expand-more-element'
                    >
                        <div className='content-expand-more'>
                            <MenuBonusProducts 
                                typeProduct={1}
                                bonusProducts={bonusProducts}
                                evalBonusPrice={evalBonusPrice}
                                bonusProductData={bonusProductData}
                                updateProduct={updateProduct}
                                productData={productData}
                            />
                        </div>
                    </ExpandMore>
                </CardActions>
            </Card>
        </Grid>
    );
}
