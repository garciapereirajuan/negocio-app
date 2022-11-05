import React from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import accounting from 'accounting'

import './Total.css'

const Total = ({ total }) => {
    return (
        <div className='total'>   
            <Typography variant='h5'>
                    
            </Typography>
            <Typography variant='h5'>
                Total: {accounting.formatMoney(total, '$')}
            </Typography>
            {/* <Button
                className='btn-confirm'
                variant='contained'
                color='success'
            >
                Confirmar
            </Button>*/}
        </div>
    )
}

export default Total
