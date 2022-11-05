import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Alert } from '@mui/material'
import ModalMui from '../../../components/ModalMui'
import LoginForm from '../../../components/LoginForm'
import RegisterForm from '../../../components/RegisterForm'
import useAuth from '../../../hooks/useAuth'

import './Login.css'

const Login = () => {
    const [openModal, setOpenModal] = useState(false)
    const [alertPage, setAlertPage] = useState([])
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (alertPage.legnth !== 0) {
            setTimeout(() => setAlertPage([]), 10000)
        }
    }, [alertPage])

    useEffect(() => {
        if (user && !isLoading) {
            navigate('/admin/products')
            return
        }
    }, [user, isLoading])


    if (!user && !isLoading) {
        return (
            <Box className='login'>
                <Typography variant='h4' textAlign='center' className='login__title'>
                    Personal autorizado
                </Typography>
                <div className='login__parraf'>
                    <p className='login__parraf-decoration'>Esta sección es sólo para personal autorizado.</p>
                    <p>Si querés realizar un pedido no necesitas iniciar sesión.</p>
                </div>

                <LoginForm
                    setOpenModal={setOpenModal}
                    setAlertPage={setAlertPage}
                />
                <ModalMui
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    contentModal={
                        <RegisterForm
                            setOpenModal={setOpenModal}
                            setAlertPage={setAlertPage}
                        />
                    }
                />
                {alertPage.length !== 0 && <Alert severity={alertPage[0]}>{alertPage[1]}</Alert>}
            </Box>
        )
    }
}

export default Login
