import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

import LayoutAdmin from '../layouts/LayoutAdmin'
import LayoutBasic from '../layouts/LayoutBasic'

//Import pages
import BasicHome from '../pages/Home'
import AdminHome from '../pages/Admin'
import AdminLogin from '../pages/Admin/Login'

//Import components
import Products from '../components/Products'
import AdminAddEditProduct from '../components/Admin/AddEditProduct'
import AdminAddEditCategory from '../components/Admin/AddEditCategory'
import AdminAddEditBonusProduct from '../components/Admin/AddEditBonusProduct'

export const routes = [
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