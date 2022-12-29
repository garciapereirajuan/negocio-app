import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MenuContext } from 'react-flexible-sliding-menu'
import { Link } from 'react-scroll'
import { showCategoriesApi } from '../../api/categories'

import HomeIcon from '@mui/icons-material/Home';

import './MenuSliding.css'

const DashboardSVG = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
    >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
);

const MenuSliding = () => {
    const [categories, setCategories] = useState([])
    const { closeMenu } = useContext(MenuContext);

    useEffect(() => {
        let categoriesForMenu = localStorage.getItem('categoriesForMenu')
        categoriesForMenu = JSON.parse(categoriesForMenu)

        setCategories(categoriesForMenu)
    }, [])

    return (
        <div className="Menu">
            <h3>Menu</h3>
            <a 
                href='/welcome' 
                spy={true} 
                smooth={true} 
                duration={500}
                onClick={() => setTimeout(() => closeMenu(), 600)}
            >
                <HomeIcon /> Inicio
            </a>
            {
                categories.length !== 0 &&
                categories.map(item => {
                    return (
                        <Link 
                            to={item.id} 
                            spy={true} 
                            smooth={true} 
                            duration={500}
                            onClick={() => setTimeout(() => closeMenu(), 600)}
                        >
                            <DashboardSVG /> {item.title}
                        </Link>
                    )
                })
            }
            <button onClick={closeMenu} className='primary-button'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
            </button>
        </div>
    )
}

export default MenuSliding
