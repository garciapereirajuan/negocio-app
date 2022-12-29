import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { Fade, Typography, Alert } from '@mui/material'
import Products from '../../components/Products'
import { showMainProductApi } from '../../api/mainProduct'
import { showCategoriesApi } from '../../api/categories'
import { showBonusProductApi } from '../../api/bonusProduct'

import CircularProgress from '@mui/material/CircularProgress'

import './Home.css'
import '../../components/Shared/ProductAndProductOfBasket/styles.css'

const Home = () => {
    const [categoryWithMainProducts, setCategoryWithMainProducts] = useState([])
    const [auxCategoryWithMainProducts, setAuxCategoryWithMainProducts] = useState([])
    const [pureCategories, setPureCategories] = useState([])
    const [allBonusProducts, setAllBonusProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [basket, setBasket] = useState([])
    const [alert, setAlert] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const totalStorage = localStorage.getItem('total')

        if (totalStorage && total === 0) {
            setTotal(totalStorage)
            return
        }

        localStorage.setItem('total', Number.parseInt(total))
    }, [total])

    useEffect(() => {
        let basketStorage = localStorage.getItem('basket')

        if (basketStorage) {
            basketStorage = JSON.parse(basketStorage)
        }

        if (basketStorage && basket.length === 0) {
            setBasket(basketStorage)
            return
        }

        localStorage.setItem('basket', JSON.stringify(basket))
    }, [])

    const updateCategoriesForMenu = (categoriesResponse) => {
        let categoriesForMenu = []

        categoriesResponse.forEach(item => {
            categoriesForMenu.push({
                id: item._id,
                title: item.title
            })
        })

        categoriesForMenu = JSON.stringify(categoriesForMenu)
        localStorage.setItem('categoriesForMenu', categoriesForMenu)
        navigate('/products?menu=true')
    }

    useEffect(() => {
        showCategoriesApi().then(response => {
            if (response?.code === 200) {
                if (response.categories.length === 0) {
                    setAlert(['warning', 'Todavía no hay nada por aquí'])
                    return
                }
                
                setAlert([])
                setPureCategories(response.categories)
                updateCategoriesForMenu(response.categories)

            }
            else {
                setAlert(['error', 'No es posible conectarme a Internet, revisa tu conexión o intenta más tarde.'])
            }
        })
        .catch(err =>                 
            setAlert(['error', 'No es posible conectarme a Internet, revisa tu conexión o intenta más tarde.'])
        )
        showBonusProductApi().then(response => {
            if (response?.code === 200) {            
                if (response.bonusProducts.length === 0) {
                    setAlert(['warning', 'Todavía no hay nada por aquí'])
                    return
                }
                
                setAlert([])
                setAllBonusProducts(response.bonusProducts)
            }
            else {
                setAlert(['error', 'No es posible conectarme a Internet, revisa tu conexión o intenta más tarde.'])
            }
        })
        .catch(err => 
            setAlert(['error', 'No es posible conectarme a Internet, revisa tu conexión o intenta más tarde.'])
        )

    }, [])

    if (alert.length !== 0) {
        return (
            <div className='home-alert-error'>
                <Alert severity={alert[0]}>{alert[1]}</Alert>
            </div>
        )
    }

    return (
        <>
            <Helmet>
                <title>Lo más rico | Rotisería Pepitos</title>
                <meta 
                    name='description'
                    content='Products | Rotisería Pepitos'
                    data-react-helmet='true'
                />
            </Helmet>
            {
                pureCategories.length === 0
                && (
                    <CircularProgress />
                )
            }
            <div className='home' id='home'>
                {
                    pureCategories.length !== 0 &&
                    pureCategories.map((item, index) => (
                            <ItemCategory
                                key={item.title}
                                category={item} 
                                allBonusProducts={allBonusProducts} 
                                setTotal={setTotal}
                                setBasket={setBasket}
                                total={total}
                                index={index}
                            />  
                        ))
                }
            </div>
        </>
    )
}

const ItemCategory = ({ category, allBonusProducts, setTotal, setBasket, total, index }) => {
    const [allMainProducts, setAllMainProducts] = useState([])

    useEffect(() => {
        showMainProductApi(category.mainProducts)
            .then(response => setAllMainProducts(response.mainProducts))
    }, [])

    if (!allMainProducts){
        return null
    }

    return (
        <section id={category._id} className={index == 0 && 'first-child'}>
            <Fade in={category} > 
                <Typography
                    variant='h4' 
                    className={`category-title ${(total > 0 && index === 0) && 'total-visible'}`}
                >
                    {category.title}
                </Typography>
            </Fade>
            {
                allMainProducts.length === 0
                ? (
                    <CircularProgress />
                ) : (
                    <Products
                        allMainProducts={allMainProducts} 
                        allBonusProducts={allBonusProducts}
                        setTotal={setTotal}
                        total={total}
                        setBasket={setBasket}
                    />
                )
            }
        </section>
    )
}

export default Home
