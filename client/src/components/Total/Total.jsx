import React from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import accounting from 'accounting'

import './Total.css'

const Total = () => {
    return (
        <div className='total'>
            <Typography variant='h5'>
                Total items: 3
            </Typography>
            <Typography variant='h5'>
                {accounting.formatMoney(50, '$')}
            </Typography>
            <Button
                className='btn-confirm'
                variant='contained'
                color='success'
            >
                Confirmar
            </Button>
        </div>
    )
}

export default Total
