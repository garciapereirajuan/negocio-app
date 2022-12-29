import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Grid } from '@mui/material'

import './LayoutBasic.css'

const LayoutBasic = ({ routes }) => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/welcome')
        }
    }, [navigate, location])

    return (
        <Grid container xs={12} justifyContent='center' className='layout-basic'>
            <Grid item xs={12} md={11} lg={10} className='layout-basic__content'>
                <Routes>
                    {
                        routes.map((route, index) => {
                            return <Route
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                element={<route.element />}
                            />
                        })
                    }
                </Routes>
            </Grid>
        </Grid>
    )
}

export default LayoutBasic
