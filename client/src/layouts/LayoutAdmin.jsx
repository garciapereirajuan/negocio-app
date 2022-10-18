import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Grid } from '@mui/material'

import './LayoutAdmin.css'

const LoadRoutes = ({ routes }) => {

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
    console.log(routes)
    return (
        <LoadRoutes routes={routes} />
    )
}

export default LayoutAdmin
