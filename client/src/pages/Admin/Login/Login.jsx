import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import ModalMui from '../../../components/ModalMui'
import LoginForm from '../../../components/LoginForm'
import RegisterForm from '../../../components/RegisterForm'
import AlertCollapse from '../../../components/AlertCollapse'
import useAuth from '../../../hooks/useAuth'

import './Login.css'

const Login = () => {
    const [openModal, setOpenModal] = useState(false)
    const [alertPage, setAlertPage] = useState([])
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        setAlertPage(['info', "Hola, inicia sesión como invitado. No vas a poder editar nada, pero podrás mirar."])
    }, [])

    useEffect(() => {
        if (window.innerWidth < 1000) {
            navigate("/products")
            return
        }
    }, [])

    useEffect(() => {
        if (user && !isLoading) {
            navigate('/admin/products')
            return
        }
    }, [user, isLoading])


    if (!user && !isLoading) {
        return (
            <>
                <Helmet>
                    <title>Ingresar | Rotisería Pepitos</title>
                    <meta 
                        name='description'
                        content='Login | Rotisería Pepitos'
                        data-react-helmet='true'
                    />
                </Helmet>
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
                    <AlertCollapse alert={alertPage} setAlert={setAlertPage} />
                </Box>
            </>
        )
    }
}

export default Login
