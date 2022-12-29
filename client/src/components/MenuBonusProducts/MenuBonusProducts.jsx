import * as React from 'react';
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { Link } from 'react-scroll'
import { Menu as MenuMui, MenuItem, Button, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import MenuIcon from '@mui/icons-material/Menu'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import './MenuBonusProducts.css'

const onChangeForProduct = (
	e, item, priceBonusProduct, 
	setEvalBonusPrice, 
	setBonusProductData
) => {

    if (priceBonusProduct) {
        priceBonusProduct = priceBonusProduct.replace('$', '')
        priceBonusProduct = priceBonusProduct.replace('c/u', '')
        priceBonusProduct = priceBonusProduct.replace(' ', '')
        
        setEvalBonusPrice(evalBonusPrice => ({ 
            ...evalBonusPrice, 
            [priceBonusProduct]: e.target.checked 
        }))
    }
    setBonusProductData(bonusProductData => ({ 
        ...bonusProductData, 
        [`${item.option} ${item.title}`]: e.target.checked 
    }))
}

const onChangeForProductOfBasket = (
	e, item, evalBonusPrice, bonusProductData, 
	priceBonusProduct, updateProduct,
	productData
) => {

    let evalBonusPriceAux = evalBonusPrice
    let bonusProductDataAux = bonusProductData

    if (priceBonusProduct) {
        priceBonusProduct = priceBonusProduct.replace('$', '')
        priceBonusProduct = priceBonusProduct.replace('c/u', '')
        priceBonusProduct = priceBonusProduct.replace(' ', '')

        evalBonusPriceAux = {
            ...evalBonusPriceAux, 
            [priceBonusProduct]: e.target.checked 
        }
    }

    bonusProductDataAux = {
        ...bonusProductDataAux, 
        [`${item.option} ${item.title}`]: e.target.checked 
    }
    updateProduct(productData, bonusProductDataAux, evalBonusPriceAux)
}

export default function MenuBonusProducts(props) {
	const [typeProduct, setTypeProduct] = React.useState(props.typeProduct)

	const { 
		bonusProducts, 
		bonusProductData, 
		setBonusProductData,
		evalBonusPrice,
		setEvalBonusPrice, 
		productData,
		updateProduct
	} = props

	return (
		<PopupState variant="popover" popupId="demo-popup-menu">
		  {(popupState) => (
		    <React.Fragment>
		      <div
		      	style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} 	
            	className='icon-menu'
		      	{...bindTrigger(popupState)}
		  	>
		        <MoreHorizIcon />
		      </div>
		      <MenuMui {...bindMenu(popupState)}>
		      	<div className='menu-item-button-close'>
		      		<Button
		      			onClick={popupState.close}
		      		>
		      			Cerrar
		      		</Button>
				</div>		      
				{
					bonusProducts?.length === 0 
					&& (
						<div className='menu-item-text-default'>
							Este producto no tiene opciones
						</div>
					)
				}	
		      	{	
		      		bonusProducts?.legnth !== 0 
		      		&& bonusProducts.map(item => {
		                let priceBonusProduct = item.price
		                let option = item.option
		                let checked = bonusProductData[`${item.option} ${item.title}`]
		                let classColor = ''

		                if (priceBonusProduct && /con/gi.test(item.option)) {
		                    priceBonusProduct = `+ $${priceBonusProduct} c/u`
		                    classColor = 'green'
		                }

		                if (priceBonusProduct && /sin/gi.test(item.option)) {
		                    priceBonusProduct = `- $${priceBonusProduct} c/u`
		                    classColor='red'
		                }

		                return (
		                    <MenuItem className={`menu-item-bonus-products ${checked ? 'checked' : ''}`}>
		                        <FormControlLabel 
		                            control={<Checkbox />}
		                            label={
		                                <div 
		                                    className={`title-price-bonus-product ${priceBonusProduct && "width-price"}`} 
		                                    title={`${item.option} ${item.title}`}
		                                >
		                                    <div 
		                                        className='title-bonus-product title-capitalize' 
		                                        // style={{marginRight: '2px'}}
		                                    >
			                                        {`${item.option} ${item.title}`}
                                    		</div>
	                                        <div className={`text-bonus-product-price ${classColor}`}>
	                                        	{priceBonusProduct}
                                    		</div>		                                    
		                                </div>
		                            }
		                            checked={bonusProductData[`${item.option} ${item.title}`]}
		                            onChange={ e => (
		                            	typeProduct === 0
		                            		? onChangeForProduct(
		                            			e, item, priceBonusProduct, 
												setEvalBonusPrice, 
												setBonusProductData
	                            			) 
		                            		: onChangeForProductOfBasket(
		                            			e, item, evalBonusPrice, bonusProductData, 
												priceBonusProduct, updateProduct,
												productData
											)
	                            	)}
		                        />
		                    </MenuItem>
		                )
		            })
		      	}
		      </MenuMui>
		    </React.Fragment>
		  )}
		</PopupState>
	);
}