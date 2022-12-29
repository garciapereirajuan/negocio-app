import * as React from 'react';
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { Link } from 'react-scroll'
import { Menu as MenuMui, MenuItem, Button, IconButton } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import MenuIcon from '@mui/icons-material/Menu'

import './Menu.css'

export default function Menu() {
    const [categories, setCategories] = React.useState([])
    const [menuCheck, setMenuCheck] = React.useState(false)
    const location = useLocation()

    React.useEffect(() => {
    	if (categories.length !== 0) {
    		return
    	}

    	let query = queryString.parse(location.search)

    	if (query.menu) {
	        let categoriesForMenu = localStorage.getItem('categoriesForMenu')
	        categoriesForMenu = JSON.parse(categoriesForMenu)

	        setCategories(categoriesForMenu)
    	}
    }, [location])

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <IconButton
          	color='inherit'
          	{...bindTrigger(popupState)}
      	>
            <MenuIcon />
          </IconButton>
          <MenuMui {...bindMenu(popupState)}>
          	<MenuItem className='menu-item-checkbox'>
          		<label>
      				<input 
      					value={menuCheck}
      					type='checkbox'
      					onClick={(e) => setMenuCheck(e.target.checked)}
  					/>
  					{' '}
          			Mantener abierto
          		</label>
          	</MenuItem>
          	{
          		(categories.length !== 0 &&
          		categories !== 'empty') && 
          		categories.map(item => (
        			<Link
        				to={item.id} 
        				spy={true} 
        				smooth={true} 
        				duration={500}
        				offset={-100}
        				delay={100}
        				onClick={() => !menuCheck && popupState.close()}
    				>
        				<MenuItem className='menu-item'>
        					{item.title}
        				</MenuItem>
        			</Link>
          		))
          	}
          </MenuMui>
        </React.Fragment>
      )}
    </PopupState>
  );
}