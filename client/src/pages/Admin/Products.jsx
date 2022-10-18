import React, { useState, useEffect } from 'react'
import ListProducts from '../../components/Admin/ListProducts'
import { showMainProductApi } from '../../api/mainProduct'

const Products = () => {
    const [allMainProducts, setAllMainProducts] = useState([])
    const [reloadAllProducts, setReloadAllProducts] = useState(false)

    useEffect(() => {

        showMainProductApi()
            .then(response => (
                setAllMainProducts(response.mainProducts)
            ))
            .catch(err => console.log('Error', err))

        setReloadAllProducts(false)
    }, [reloadAllProducts])

    return (
        <div>
            <ListProducts allMainProducts={allMainProducts} setReloadAllProducts={setReloadAllProducts} />
        </div>
    )
}

export default Products
