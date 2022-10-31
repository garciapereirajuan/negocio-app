import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import Products from '../../components/Products'
import { showMainProductApi } from '../../api/mainProduct'
import { showCategoriesApi } from '../../api/categories'

import './Home.css'

const Home = () => {
    const [allMainProducts, setAllMainProducts] = useState([])
    const [categoryWithMainProducts, setCategoryWithMainProducts] = useState([])
    const [auxCategoryWithMainProducts, setAuxCategoryWithMainProducts] = useState([])
    const [pureCategories, setPureCategories] = useState([])
    const [reloadAllMainProducts, setReloadAllMainProducts] = useState(false)

    useEffect(() => {
        showCategoriesApi().then(response => setPureCategories(response.categories))
    }, [])

    return (
        <div className='home'>
            {
                pureCategories && pureCategories.map(item => (
                    <ItemCategory category={item} />
                ))
            }
        
        </div>
    )
}

const ItemCategory = ({ category }) => {
    const [allMainProducts, setAllMainProducts] = useState([])

    useEffect(() => {
        const arrayMainProducts = []

        showMainProductApi(category.mainProducts).then(response => setAllMainProducts(response.mainProducts))

        console.log('allMainProducts', allMainProducts)
    }, [])

    if (!allMainProducts){
        return null
    }

    return (
        <>
            <Typography variant='h4' className='category-title'>
                {category.title}
            </Typography>
            <Products allMainProducts={allMainProducts} />
        </>
    )
}

export default Home
