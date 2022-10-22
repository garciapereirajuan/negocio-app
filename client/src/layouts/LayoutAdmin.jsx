import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Grid } from '@mui/material'
import useAuth from '../hooks/useAuth'

import './LayoutAdmin.css'

const LoadRoutes = ({ routes }) => {
    const { user, isLoading } = useAuth() 
    const navigate = useNavigate()

    useEffect(() => {
        if (!user && !isLoading) {
            navigate('/admin/login')
        }
    }, [user, isLoading])

    return (
        <Grid container justifyContent='center' className='layout-admin'>
            <Grid item xs={12} sm={12} md={11} lg={11} className='layout-admin__content'>
                <Routes>
                    {
                        routes.map((route, index) => {
                            return <Route
                                key={index}
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

const LayoutAdmin = ({ routes }) => {
    return (
        <LoadRoutes routes={routes} />
    )
}

export default LayoutAdmin
