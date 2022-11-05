import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Button } from '@mui/material'
import Products from '../../components/Products'
import { showBonusProductApi } from '../../api/bonusProduct'
import accounting from 'accounting'

import './ShoppingCart.css'

const ShoppingCart = () => {
	const [basket, setBasket] = useState([])
	const [total, setTotal] = useState(0)
	const [bonusProducts, setBonusProducts] = useState([])
	const [reloadBasket, setReloadBasket] = useState(false)
	const [reloadTotal, setReloadTotal] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		const totalStorage = localStorage.getItem('total')

		if (totalStorage && total === 0) {
			setTotal(totalStorage)
			return
		}

		if (totalStorage) {
			setTotal(Number.parseInt(totalStorage))
			setReloadTotal(false)
			return
		}

		localStorage.setItem('total', total)
		setReloadTotal(false)
	}, [reloadTotal])

	useEffect(() => {
		let basketStorage = localStorage.getItem('basket')

		if (!basketStorage) {
			return
		}

		basketStorage = JSON.parse(basketStorage)
		setBasket(basketStorage)
		
		setReloadBasket(false)
	}, [reloadBasket])

	useEffect(() => {
		showBonusProductApi()
			.then(response => setBonusProducts(response.bonusProducts))
	}, [])

	if (basket.length === 0) {
		return (
			<div className='shopping-cart'>
				<Typography 
	                variant='h4' 
	                className={`category-title`}
	            >
	                Confirmá tu pedido
	            </Typography>
	            <Typography variant='h6'>
	            	Tu carrito de compras está vacío.
	            </Typography>
            	<Button
            		onClick={() => navigate('/products')}
            	>
            		Volver
            	</Button>
			</div>
		)
	}

	return (
		<div className='shopping-cart'>
			<Typography 
                variant='h4' 
                className={`category-title`}
            >
                Confirmá tu pedido
            </Typography>
            <Typography>
            	Presioná confirmar para generar el mensaje con tu pedido
            </Typography>
            <Typography>
            	y enviarlo por WhatsApp
            </Typography>
            <Total total={total}/>
            <Typography className='last-typography'>
            	Ó podés modificar tu pedido
            </Typography>
			{
				// (basket && basket.length !== 0) && 
				// 	basket.map(item => (
				// 		<Product 
				// 			product={item}
				// 			bonusProducts={bonusProducts}
				// 			bonusProductsOk={item.bonusProductsOk}
				// 			setTotal={() => {}}
				// 			setBasket={() => {}}
				// 		/>
				// 	))
			}
			<Products 
				allMainProducts={basket} 
				allBonusProducts={bonusProducts} 
				setTotal={() => {}} 
				setBasket={() => {}} 
				fromBasket={true} 
				reloadBasket={reloadBasket}
				reloadTotal={reloadTotal}
				setReloadBasket={setReloadBasket}
				setReloadTotal={setReloadTotal}
			/>
			<Typography 
                variant='h4' 
                className={`category-title`}
            >
                Confirmá tu pedido
            </Typography>
            <Typography>
            	Presioná confirmar para generar el mensaje con tu pedido
            </Typography>
            <Typography>
            	y enviarlo por WhatsApp
            </Typography>
            <Total total={total}/>
		</div>
	)
}

const Total = ({ total }) => {
	return (
		<div className='shopping-cart__total'>
			<Typography variant='h5'>
				Total
			</Typography>
			<Typography variant='h5'>
			{accounting.formatMoney(total, '$')}
			</Typography>
			<br/>
     		<Button
                className='btn-confirm'
                variant='contained'
                color='success'
            >
                Confirmar
            </Button>
		</div>
	)
}

export default ShoppingCart