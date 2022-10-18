import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CheckoutCard from '../CheckoutCard'
import Total from '../Total'
import { products } from '../../utils/productsArray'


const CheckoutPage = () => {
    // const [{basket}, dispatch] = useStateValue()

    const FormRow = () => {
        return (
            <>
                {
                    products?.map(item => (
                        <Grid item xs={12} sm={8} md={6} lg={4}>
                            <CheckoutCard key={item.id} product={item} />
                        </Grid>
                    ))
                }
            </>
        )
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography align='center' gutterBottom variant='h4'>
                        Carrito de compras
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={8} md={9} container spacing={2}>
                    <FormRow />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <Typography align='center' gutterBottom variant='h4'>
                        <Total />
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default CheckoutPage
