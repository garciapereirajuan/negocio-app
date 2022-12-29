import { useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Grid } from '@mui/material'
import useAuth from '../hooks/useAuth'

import './LayoutAdmin.css'

const LoadRoutes = ({ routes }) => {
    const { user, isLoading } = useAuth() 
    const navigate = useNavigate()
    const location = useLocation()
    const layout = useRef()

    useEffect(() => {
        if (!user && !isLoading) {
            navigate('/admin/login')
        }
    }, [user, isLoading])

    useEffect(() => {
        if (location.pathname === '/admin/login') {
            layout.current.classList.add('background-layout')
        }
    }, [])

    return (
        <Grid container xs={12} justifyContent='center' ref={layout} className='layout-admin'>
            <Grid item xs={11} className='layout-admin__content'>
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
