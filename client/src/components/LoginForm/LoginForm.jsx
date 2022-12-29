import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, FormControl, TextField, Button } from '@mui/material'
import { loginUserApi } from '../../api/user'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../utils/constants'

import './LoginForm.css'

const LoginForm = ({ setOpenModal, setAlertPage }) => {
    const [userData, setUserData] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        setUserData({...userData, user: "Invitado", password: "invitado"})
    }, [])

    const login = (e) => {
        e.preventDefault()

        const { user, password } = userData
        let email, username = null

        if (!user) {
            setAlertPage(['error', 'Debes ingresar con tu nombre de usuario o correo electrónico.'])
            return
        }

        if (!password) {
            setAlertPage(['error', 'Ingresa tu contraseña.'])
        }

        if (/@/.test(user)) {
            email = user
        } else {
            username = user
        }

        const data = { email, username, password }

        loginUserApi(data)
            .then(response => {
                if (!response.code) {
                    setAlertPage(['error', 'Ocurrió un error interno, intenta más tarde.'])
                    return
                }
                if (response.code === 202) {
                    setAlertPage(['warning', response.message])
                    return
                }
                if (response.code !== 200) {
                    setAlertPage(['error', response.message])
                    return
                }
                if (response.code === 200) {
                    const { accessToken, refreshToken } = response

                    localStorage.setItem(ACCESS_TOKEN, accessToken)
                    localStorage.setItem(REFRESH_TOKEN, refreshToken)

                    setAlertPage(['success', response.message])
                    window.location.href = '/admin/products'
                }
            })
            .catch(err => setAlertPage(['error', 'Ocurrió un error interno, intenta más tarde.']))
    }

    return (
        <Box className='login-form'>
            <form
                className='login-form__form'
                onSubmit={(e) => login(e)}
            >
                <FormControl>
                    <TextField
                        label='Nombre de usuario o correo electrónico'
                        value={userData.user || "Invitado"}
                        onChange={(e) => setUserData({ ...userData, user: e.target.value })}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Contraseña'
                        value={userData.password || "invitado"}
                        type='password'
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    />
                </FormControl>
                <FormControl>
                    <Button
                        type='submit'
                        variant='contained'
                        className='btn-submit'
                    >
                        Ingresar
                    </Button>
                </FormControl>
            </form>

            <div className='login-form__parraf'>
                <div>O crea una{' '}
                    <div
                        className='login-form__parraf-a'
                        onClick={() => setOpenModal(true)}
                    >
                        cuenta nueva
                    </div>
                </div>
            </div>
        </Box>
    )
}

export default LoginForm
