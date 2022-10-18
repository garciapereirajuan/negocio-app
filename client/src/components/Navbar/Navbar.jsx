import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material'
import useAuth from '../../hooks/useAuth'
import { logout } from '../../api/auth'

import ShoppingCart from '@mui/icons-material/ShoppingCart';
import PepitosLogo from '../../assets/img/png/pepitos-logo.png';

import './Navbar.css'

const btnIn = (
    <Link to='/admin/login'>
        <Button
            color="inherit"
            className='btn-in-and-out'
        >
            Ingresar
        </Button>
    </Link>
)

const btnOut = (
    <Button
        onClick={() => {
            logout()
            window.location.href = '/products'
        }}
        color="inherit"
        className='btn-in-and-out'
    >
        Salir
    </Button>
)

const btnNewBonus = (
    <Link to='/admin/bonus'>
        <Button
            color='inherit'
            className='btn-product-and-bonus'
        >
            Crear complemento
        </Button>
    </Link>
)

const btnNewProduct = (
    <Link to='/admin/product'>
        <Button
            color='inherit'
            className='btn-product-and-bonus'
        >
            Crear producto
        </Button>
    </Link>
)

const btnNewCategory = (
    <Link to='/admin/category'>
        <Button
            color='inherit'
            className='btn-product-and-bonus'
        >
            Crear categoría
        </Button>
    </Link>
)

const btnGoToAdmin = (
    <Link to='/admin/products'>
        <Button
            color='inherit'
            className='btn-product-and-bonus'
        >
            Editar sitio
        </Button>
    </Link>
)

export default function Navbar() {
    const [title, setTitle] = useState('¡Pedí lo que quieras!')
    const [btnInOut, setBtnInOut] = useState(btnIn)
    const [contentCenter, setContentCenter] = useState('¡Pedí lo que quieras!')
    const location = useLocation()
    const { user, isLoading } = useAuth()

    useEffect(() => {
        if (location.pathname === '/products') {
            setTitle('¡Pedí lo que quieras!')
        }
        if (location.pathname === '/admin/login') {
            setTitle('¡Hola!')
        }
    }, [location])

    useEffect(() => {
        if (user && !isLoading) {
            setBtnInOut(btnOut)
            setContentCenter(
                <>
                    {btnNewCategory}
                    {btnNewProduct}
                    {btnNewBonus}
                </>
            )
            return
        }

        setContentCenter(title)
        setBtnInOut(btnIn)
    }, [user, isLoading, location])

    useEffect(() => {
        if (location.pathname === '/admin/products') {
            return
        }
        if (user && !isLoading) {
            setContentCenter(
                btnGoToAdmin
            )
        }
    }, [location, user, isLoading])




    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <Link to='/products'>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <img src={PepitosLogo} width={140} alt='Logo de Rotisería Pepitos' />
                        </IconButton>
                    </Link>
                    {
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {contentCenter}
                        </Typography>
                    }
                    {btnInOut}
                    {/* <Link to='/checkout-page' onClick={addToBasket}>
                        <IconButton color="inherit">
                            <Badge badgeContent={2} color='error'>
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </Link> */}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
