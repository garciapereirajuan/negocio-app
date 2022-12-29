import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

import LayoutAdmin from '../layouts/LayoutAdmin'
import LayoutBasic from '../layouts/LayoutBasic'

//Import pages
import BasicWelcome from '../pages/Welcome'
import BasicHome from '../pages/Home'
import BasicShoppingCart from '../pages/ShoppingCart'
import BasicConfirm from '../pages/Confirm'
import AdminHome from '../pages/Admin'
import AdminLogin from '../pages/Admin/Login'

//Import components
import Products from '../components/Products'
import AdminAddEditProduct from '../components/Admin/AddEditProduct'
import AdminAddEditCategory from '../components/Admin/AddEditCategory'
import AdminAddEditBonusProduct from '../components/Admin/AddEditBonusProduct'

export const routes = [
    {
        path: '/welcome',
        element: BasicWelcome
    },
    {
        path: '/admin/*',
        element: LayoutAdmin,
        routes: [
            {
                path: '/login',
                element: AdminLogin
            },
            {
                path: '/products',
                element: AdminHome
            },
            {
                path: '/product',
                element: AdminAddEditProduct
            },
            {
                path: '/category',
                element: AdminAddEditCategory
            },
            {
                path: '/bonus-product',
                element: AdminAddEditBonusProduct
            },
            {
                path: '/*',
                element: () => (
                    <>
                        <div style={{color: "#e2e2e2"}}>
                            Error 404<br/>
                            Esta página no esta disonible
                        </div>
                        <Link to='/products'>
                            <Button style={{color: "#e2e2e2"}}>
                                Ir a incio
                            </Button>
                        </Link>
                    </>
                )
            }
        ]
    },
    {
        path: '/*',
        element: LayoutBasic,
        routes: [
            {
                path: '/products',
                element: BasicHome,
            },
            {
                path: '/shopping-cart',
                element: BasicShoppingCart,
            },
            {
                path: '/confirm',
                element: BasicConfirm,
            },
            {
                path: '/*',
                element: () => (
                    <>
                        <div>
                            Error 404<br/>
                            Esta página no esta disonible
                        </div>
                        <Link to='/products'>
                            <Button>
                                Ir a incio
                            </Button>
                        </Link>
                    </>
                )
            }
            
        ]
    }
]