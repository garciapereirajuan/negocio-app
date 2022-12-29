import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import accounting from 'accounting'

import './Total.css'

const Total = ({ total }) => {
    const navigate = useNavigate()

    return (
        <div className='total' onClick={() => navigate('/shopping-cart')}>
            <Typography variant='h5'>
                Total: {accounting.formatMoney(total, '$')}
            </Typography>
        </div>
    )
}

export default Total
