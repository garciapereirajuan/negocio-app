import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, ListItem, IconButton, ListItemText, FormControlLabel, Checkbox, Alert } from '@mui/material'
import DragSortableList from 'react-drag-sortable'
import { getAccessTokenApi } from '../../../api/auth'
import { updateBonusProductSpecialApi, removeBonusProductApi } from '../../../api/bonusProduct'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import './ListBonusProducts.css'

const ListBonusProducts = ({ allBonusProducts, setReloadAllBonusProducts }) => {
	const [itemsBonusProducts, setItemsBonusProducts] = useState([])
    const [alert, setAlert] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const messageAboutBonusColor = localStorage.getItem('messageAboutBonusColor')

        if (!messageAboutBonusColor) {
            setAlert(['warning', 'Los colores rojo y verde son para identificar fácilmente los complementos. Siendo de color verde los que tienen la palabra "con", y de color rojo los que tienen la palabra "sin".'])
        }

        return () => localStorage.setItem('messageAboutBonusColor', true)
    }, [])

    useEffect(() => {
        const itemsArray = []

        allBonusProducts && allBonusProducts.forEach(item => {
            itemsArray.push({
                content: (
                    <Item 
                        bonusProduct={item}
                        editBonusProduct={editBonusProduct}
                        updateForCheckbox={updateForCheckbox}
                        deleteBonusProduct={deleteBonusProduct}
                    />
                )
            })
        })

        setItemsBonusProducts(itemsArray)
    }, [allBonusProducts])

    const editBonusProduct = (bonusProduct) => {
        const data = JSON.stringify(bonusProduct)
        navigate(`/admin/bonus-product?data=${data}`)
    }

    const updateForCheckbox = (product, element) => {
        const token = getAccessTokenApi()

        updateBonusProductSpecialApi(token, product._id, element)
            .then(response => {
                if (!response) {
                    setAlert(['error', 'Ocurrió un error en el servidor, intenta más tarde.'])
                    return
                }
                if (response?.code !== 200) {
                    setAlert(['error', response.message])
                    return
                }

                setAlert(['success', response.message])
                setReloadAllBonusProducts(true)
            })
            .catch(err => {
                setAlert(['error', 'Ocurrió un error en el servidor, intenta más tarde.'])
            })
        
    }

    const deleteBonusProduct = () => {
        console.log('Eliminar bonusProduct')
    }

    const onSort = () => {}

	return(
        <>
            {alert.length !== 0 && <Alert severity={alert[0]}>{alert[1]}</Alert>}
            <List className='list-bonus-products'>
                <DragSortableList items={itemsBonusProducts} onSort={onSort} type='vertical' />
            </List>
        </>
    )
}

const Item = ({ bonusProduct, editBonusProduct, updateForCheckbox, deleteBonusProduct }) => {
    const colorClass = bonusProduct.option !== 'sin' ? 'bg-color-with' : 'bg-color-without'

    return(
       <ListItem
            className='list-bonus-products__list-item'
            secondaryAction={
                <>
                    <IconButton
                        edge ="start"
                        className='edit-icon'
                        aria-label="edit"
                        onClick={() => editBonusProduct(bonusProduct)}
                    >
                        <EditIcon /> 
                    </IconButton>
                    <IconButton
                        edge="end"
                        className='delete-icon'
                        aria-label="delete"
                        onClick={() => deleteBonusProduct(bonusProduct)}
                    >
                        <DeleteIcon /> 
                    </IconButton>
                </>
            }
        >
  
            <ListItemText
                primary={
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span>Complemento:</span>{' '}
                        <div 
                            className={`title-div title-capitalize format-icon ${colorClass}`}
                        >
                            {`${bonusProduct.option} ${bonusProduct.title}`}
                        </div>
                    </div>
                }   
                // secondary={product.description}
            />
            <div className='form-group-checkbox'>
                <div className='form-checkbox'>
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Visible"
                        checked={bonusProduct.visible}
                        onChange={(e) => updateForCheckbox(bonusProduct, { visible: e.target.checked })}
                    />
                </div>
                <div className='form-checkbox'>
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        disabled={bonusProduct.option === 'sin'}
                        label="Hay stock"
                        checked={bonusProduct.stock}
                        onChange={(e) => updateForCheckbox(bonusProduct, { stock: e.target.checked })}
                    />
                </div>
            </div>
        </ListItem>
    )
}

export default ListBonusProducts