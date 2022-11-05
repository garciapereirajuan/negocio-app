import React, { useState, useEffect } from 'react';
import { makeStyles, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Product from '../Product'
import ProductOfBasket from '../ProductOfBasket'
import { products } from '../../utils/productsArray'

import './Products.css'

export default function Products({ allMainProducts, allBonusProducts, setTotal, setBasket, fromBasket, reloadBasket, reloadTotal, setReloadBasket, setReloadTotal }) {
    let array = []

    const getBonusProducts = (mainProduct) => {

        allBonusProducts && allBonusProducts.forEach(itemWithData => {
            mainProduct?.bonusProducts.forEach(item => {
                if (item === itemWithData._id) {
                    array.push(itemWithData)
                }
            })
        })
        // mainProduct.bonusProducts = array
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {
                    allMainProducts && allMainProducts.map(item => {
                        array = []

                        if (item?.bonusProducts.length !== 0) {
                            getBonusProducts(item)
                        }

                        if (!fromBasket) {
                            return item.visible && (
                                <Product 
                                    key={item.id} 
                                    product={item}
                                    bonusProducts={array}
                                    bonusProductsOk={item.bonusProductsOk || undefined}
                                    setTotal={setTotal}
                                    setBasket={setBasket}
                                />
                            )
                        }

                        return item.visible && (
                            <ProductOfBasket 
                                key={item.id} 
                                product={item}
                                bonusProducts={array}
                                bonusProductsOk={item.bonusProductsOk || undefined}
                                setTotal={setTotal}
                                setBasket={setBasket}
                                reloadBasket={reloadBasket}
                                reloadTotal={reloadTotal}
                                setReloadBasket={setReloadBasket}
                                setReloadTotal={setReloadTotal}
                            />
                        )   
                    })
                }
            </Grid>
        </Box>
    );
}
