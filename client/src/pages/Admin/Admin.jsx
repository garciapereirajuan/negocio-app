import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { Switch, Grid, Typography } from '@mui/material'
import ListMainProducts from '../../components/Admin/ListMainProducts'
import ListCategories from '../../components/Admin/ListCategories'
import ListBonusProducts from '../../components/Admin/ListBonusProducts'
import { showMainProductApi } from '../../api/mainProduct'
import { showCategoriesApi } from '../../api/categories'
import { showBonusProductApi } from '../../api/bonusProduct'

const Products = () => {
    const [allMainProducts, setAllMainProducts] = useState([])
    const [allCategories, setAllCategories] = useState([])          
    const [allBonusProducts, setAllBonusProducts] = useState([])
    const [reloadAllMainProducts, setReloadAllMainProducts] = useState(false)
    const [reloadAllCategories, setReloadAllCategories] = useState(false)
    const [reloadAllBonusProducts, setReloadAllBonusProducts] = useState(false)
    const [selectedMainProducts, setSelectedMainProducts] = useState(true)

    const spanProducts = useRef()
    const spanBonus = useRef()
    const location = useLocation()
    const navigate = useNavigate()
    const query = queryString.parse(location.search)

    useEffect(() => {
        if (!query || query?.bonuspage === 'false') {
            setSelectedMainProducts(true)
            return
        }

        if (query?.bonuspage) {
            setSelectedMainProducts(false)
            return
        }

    }, [location, query])

    useEffect(() => {
        showMainProductApi()
            .then(response => {
                if (!response.code) {
                    console.log('Parece que hay un problema de conexión. Intenta más tarde.')
                }
                setAllMainProducts(response.mainProducts)
            })
            .catch(err => console.log('Error', err))

        setReloadAllMainProducts(false)
    }, [reloadAllMainProducts])

    useEffect(() => {
        showCategoriesApi()
            .then(response => {
                if (!response.code) {
                    console.log('Parece que hay un problema de conexión. Intenta más tarde.')
                }
                setAllCategories(response.categories)
            })
            .catch(err => console.log('Error', err))

        setReloadAllCategories(true)
    }, [reloadAllCategories])

    useEffect(() => {
        !selectedMainProducts && showBonusProductApi()
            .then(response => {
                if (!response.code) {
                    console.log('Parece que hay un problema de conexión. Intenta más tarde.')
                }
                setAllBonusProducts(response.bonusProducts)
            })
            .catch(err => console.log('Error', err))

        setReloadAllBonusProducts(false)
    }, [reloadAllBonusProducts, selectedMainProducts])

    useEffect(() => {
        spanProducts.current.style = 'font-weight: lighter;'
        spanBonus.current.style = 'font-weight: lighter;'

        selectedMainProducts
            ? spanProducts.current.style = 'font-weight: bold'
            : spanBonus.current.style = 'font-weight: bold'
    }, [selectedMainProducts])

    return (
        <div>
            <Grid container xs={12} justifyContent='space-between' className='list-products'>
                <Grid item xs={1.8} justifyContent='center'>
                    <Typography variant='h6' className='format-icon'>
                        Categorías
                    </Typography>
                    <ListCategories allCategories={allCategories} />
                </Grid>
                <Grid item xs={10} justifyContent='center'>
                    <Typography variant='h6' className='format-icon'>
                        <span ref={spanProducts} >Productos</span>
                        <Switch
                            color='default'
                            checked={!selectedMainProducts}
                            onChange={(e) => navigate(`/admin/products?bonuspage=${e.target.checked}`)}
                        />
                        <span ref={spanBonus} >Complementos</span>
                    </Typography>
                    {
                        selectedMainProducts
                            ? <ListMainProducts 
                                allMainProducts={allMainProducts} 
                                setReloadAllMainProducts={setReloadAllMainProducts} 
                            />
                            : <ListBonusProducts 
                                allBonusProducts={allBonusProducts} 
                                setReloadAllBonusProducts={setReloadAllBonusProducts} 
                            />
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default Products
