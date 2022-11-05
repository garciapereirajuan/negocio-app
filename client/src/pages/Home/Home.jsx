import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import Products from '../../components/Products'
import { showMainProductApi } from '../../api/mainProduct'
import { showCategoriesApi } from '../../api/categories'
import { showBonusProductApi } from '../../api/bonusProduct'
import Total from '../../components/Total'

import './Home.css'

const Home = () => {
    const [categoryWithMainProducts, setCategoryWithMainProducts] = useState([])
    const [auxCategoryWithMainProducts, setAuxCategoryWithMainProducts] = useState([])
    const [pureCategories, setPureCategories] = useState([])
    const [allBonusProducts, setAllBonusProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [basket, setBasket] = useState([])

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

    useEffect(() => {
        showCategoriesApi().then(response => setPureCategories(response.categories))
        showBonusProductApi().then(response => setAllBonusProducts(response.bonusProducts))
    }, [])

    return (
        <div className='home'>
            {total > 0 && <Total total={total} />}
            {
                pureCategories && pureCategories.map((item, index) => (
                    <ItemCategory 
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
        <>
            <Typography 
                variant='h4' 
                className={`category-title ${(total > 0 && index === 0) && 'total-visible'}`}
            >
                {category.title}
            </Typography>
            <Products 
                allMainProducts={allMainProducts} 
                allBonusProducts={allBonusProducts}
                setTotal={setTotal}
                setBasket={setBasket}
            />
        </>
    )
}

export default Home
