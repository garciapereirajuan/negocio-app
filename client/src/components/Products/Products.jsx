import React from 'react';
import { makeStyles, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Product from '../Product'
import { products } from '../../utils/productsArray'

import './Products.css'

export default function Products({ allMainProducts }) {
    console.log(allMainProducts)

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {
                    allMainProducts && allMainProducts.map(item => (
                        item.visible && (
                            <Product key={item.id} product={item} />
                        )
                    ))
                }
            </Grid>
        </Box>
    );
}
