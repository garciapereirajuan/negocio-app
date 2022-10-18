import React, { useState, useEffect } from 'react'
import { Box, Typography, FormControl, TextField, Button, Alert } from '@mui/material'
import { addUserApi } from '../../api/user'

import './RegisterForm.css'

const RegisterForm = ({ setOpenModal, setAlertPage }) => {
    const [userData, setUserData] = useState({})
    const [alert, setAlert] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setUserData({
                email: '',
                username: '',
                password: ''
            })
        }, 1000)
    }, [])

    const register = (e) => {
        e.preventDefault()

        const { email, username, password, repeatPassword } = userData

        if (!email || !username || !password || !repeatPassword) {
            setAlert(['error', 'Todos los campos son obligatorios.'])
            return
        }

        if (password !== repeatPassword) {
            setAlert(['error', 'Las contraseñas deben coincidir.'])
            return
        }

        addUserApi(userData)
            .then(response => {
                if (response?.code !== 200) {
                    setAlert(['error', response.message])
                    return
                }
                if (response?.code === 200) {
                    setAlertPage(['success', 'Usuario creado correctamente.'])
                    setOpenModal(false)
                    userData({})
                    return
                }

                setAlert(['error', 'Ocurrió un error interno, intente más tarde.'])
            })
            .catch(err => setAlert(['error', 'Ocurrió un error interno, intente más tarde.']))
    }

    return (
        <Box className='register-form'>
            <Typography variant='h5' color='#000' textAlign='center'>Registrarse</Typography>
            <form
                className='register-form__form'
                onSubmit={(e) => register(e)}
                onChange={(e) => setAlert([])}
            >
                <FormControl>
                    <TextField
                        label='Email'
                        type='email'
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        autoComplete='off'
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Nuevo nombre de usuario'
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        autoComplete='off'
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Nueva contraseña'
                        type='password'
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        autoComplete='off'
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Repetir nueva contraseña'
                        type='password'
                        value={userData.repeatPassword}
                        onChange={(e) => setUserData({ ...userData, repeatPassword: e.target.value })}
                        autoComplete='off'
                    />
                </FormControl>
                <FormControl>
                    <Button
                        type='submit'
                        variant='contained'
                        className='btn-submit'
                    >
                        Registrarse
                    </Button>
                </FormControl>
            </form>
            {alert.length !== 0 && <Alert severity={alert[0]}>{alert[1]}</Alert>}
        </Box>
    )
}

export default RegisterForm
