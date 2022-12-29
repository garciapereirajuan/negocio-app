import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material'
import Menu from '../Menu'
import Total from '../Total'
import DialogMui from '../DialogMui'
import exportStyleButtonDialog from '../DialogMui/exportStyleButtonDialog'
import useAuth from '../../hooks/useAuth'
import { logout } from '../../api/auth'
import queryString from 'query-string'

import ShoppingCart from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import PepitosLogo from '../../assets/img/png/pepitos-logo.png';

import './Navbar.css'

const btnIn = (
    <Link to='/admin/login'>
        <IconButton
            color="inherit"
            className='btn-in-and-out'
        >
            <AccountCircle />
        </IconButton>
    </Link>
)

const prevView = (
    <Link to='/products'>
        <Button
            variant='contained'
        >
            Ver sitio
        </Button>
    </Link>
)

const btnArrowBack = (
    <Link to='/products'>
        <IconButton
            color='inherit'
            className='btn-back'
        >
            <ArrowBackIosIcon />
        </IconButton>
    </Link>
)

const btnNewBonus = (
    <Link to='/admin/bonus-product'>
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
            // color='inherit'
            // className='btn-product-and-bonus'
            variant='contained'
        >
            Editar sitio
        </Button>
    </Link>
)

const IconLogo = () => (
    <Link to='/welcome'>
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
)

export default function Navbar() {
    const [openDialog, setOpenDialog] = useState(false)
    const [titleDialog, setTitleDialog] = useState("")
    const [contentDialog, setContentDialog] = useState(null)
    const [actionsDialog, setActionsDialog] = useState(null)
    const [title, setTitle] = useState('')
    const [total, setTotal] = useState(0)
    const [btnInOut, setBtnInOut] = useState(btnIn)
    const [contentCenter, setContentCenter] = useState('')
    const [notification, setNotification] = useState(0)
    const [locationPath, setLocationPath] = useState('')

    const location = useLocation()
    const { user, isLoading } = useAuth()

    const widthScreen = window.innerWidth 

    useEffect(() => {
        setLocationPath(location.pathname)

        if (location.pathname === "/confirm") {
            setTitle("")
            return
        }
        if (location.pathname === '/products') {
            setTitle(total > 0 ? <Total total={total} /> : 'Organizá tu pedido')
            return
        }
        if (location.pathname === '/admin/login') {
            setTitle('Ingresá como administrador')
            return
        }
        if (location.pathname === '/shopping-cart') {
            setTitle('Generá el mensaje con tu pedido')
            return
        }
    }, [location, total])

    useEffect(() => {
        if (widthScreen <= 1000) {
            return
        }

        if (user && !isLoading) {
            if (!/admin/.test(locationPath)) {
                return
            }

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
    }, [user, isLoading, location, title])

    useEffect(() => {
        if (location.pathname === '/admin/products') {
            setContentCenter(
                <>
                    {btnNewCategory}
                    {btnNewProduct}
                    {btnNewBonus}
                </>
            )
            return
        }
        if (user && !isLoading) {
            setBtnInOut(btnOut)
            setContentCenter(
                btnGoToAdmin
            )
        }
    }, [location, user, isLoading])

    useEffect(() => {
        const basketLength = localStorage.getItem('basketLength')

        if (basketLength) {
            setNotification(Number.parseInt(basketLength))
            return
        }
    }, [location])

    useEffect(() => {
        let query = queryString.parse(location.search)
        
        if (query) {
            const totalStorage = localStorage.getItem('total')


            if (!totalStorage || totalStorage === 0) {
                return
            }
            
            setTotal(totalStorage)
        }

    }, [location])

    const logoutDialog = () => {
        const { styleButtonDialogConfirm, styleButtonDialogCancel } = exportStyleButtonDialog

        const cancel = () => {
            setOpenDialog(false)
        }
        
        const confirm = () => {
            logout()
            window.location.href = '/products'
        }

        setOpenDialog(true)
        setTitleDialog('Cerrarando sesión...')
        setContentDialog(
            <div style={{display: 'flex'}}>
                <div style={{marginRight: '4px'}}>
                    ¿Quieres cerrar sesión?<br/>
                    Para volver al panel de Administrador deberás ingresar de nuevo.
                </div>
            </div>
        )
        
        setActionsDialog(
            <>
                <Button
                    onClick={cancel}
                    variant="contained"
                    style={styleButtonDialogCancel}
                >
                    Cancelar
                </Button>   
                <Button
                    style={styleButtonDialogConfirm}
                    variant="contained"
                    onClick={confirm}
                >
                    Cerrar sesión
                </Button>
            </>
        )
    }

    const btnOut = (
        <IconButton
            onClick={logoutDialog}
            color="inherit"
            className='btn-in-and-out'
        >
            <LogoutIcon />
        </IconButton>   
    )

    if (locationPath === '/welcome') {
        return
    }

    return (
        <Box sx={{ flexGrow: 1 }} className='navbar'>
            <AppBar position="fixed">
                <Toolbar>
                    {
                        widthScreen >= 1000 
                            ? (
                                <IconLogo />
                            ) :
                                total > 0 
                                    ? <Total total={total} />
                                    : <IconLogo />
                            
                    }
                    
                    {
                        (/admin/.test(locationPath) && user && !isLoading)
                            && 
                        <>{prevView}</>
                    }
                    {
                        widthScreen >= 1000
                            ? (
                                <>
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                        {contentCenter}
                                    </Typography>
                                    <div className='required-space-bar' />
                                    {
                                        /shopping-cart|login|confirm/.test(locationPath) 
                                        ? <>{btnArrowBack}</>
                                        : <></>
                                    }
                                    {btnInOut}  
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    </Typography>
                                    {/shopping-cart/.test(locationPath) && btnArrowBack}
                                </>
                            )
                    }
                    <Link 
                        to='/shopping-cart'
                    >
                        <IconButton color="inherit">
                            <Badge badgeContent={notification} color='error'>
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </Link>
                    {locationPath === '/products' && <Menu />}
                </Toolbar>
{/*                <section className='group-shadow-decoration'>
                    <div className='shadow-decoration' />
                    <div className='shadow-decoration' />
                    <div className='shadow-decoration' />
                    <div className='shadow-decoration' />
                    <div className='shadow-decoration' />
                </section>*/}
            </AppBar>
            <DialogMui 
                openDialog={openDialog} 
                setOpenDialog={setOpenDialog} 
                titleDialog={titleDialog}
                contentDialog={contentDialog}
                actionsDialog={actionsDialog}
            />
        </Box>
    );
}
