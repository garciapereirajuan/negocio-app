import React, { useState, useEffect } from 'react'
import Products from '../components/Products'
import { showMainProductApi } from '../api/mainProduct'

const Home = () => {
    const [allMainProducts, setAllMainProducts] = useState([])
    const [reloadAllMainProducts, setReloadAllMainProducts] = useState(false)

    useEffect(() => {
        showMainProductApi().then(response => setAllMainProducts(response.mainProducts))
        setReloadAllMainProducts(false)
    }, [reloadAllMainProducts])

    return (
        <div>
            <Products allMainProducts={allMainProducts} />
        </div>
    )
}

export default Home
