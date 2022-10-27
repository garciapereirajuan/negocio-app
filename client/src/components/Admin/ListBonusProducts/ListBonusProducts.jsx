import { useState, useEffect } from 'react'
import { List, ListItem, IconButton, ListItemText, FormControlLabel, Checkbox } from '@mui/material'
import DragSortableList from 'react-drag-sortable'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const ListBonusProducts = ({ allBonusProducts }) => {
	const [itemsBonusProducts, setItemsBonusProducts] = useState([])

    useEffect(() => {
        const itemsArray = []

        allBonusProducts && allBonusProducts.forEach(item => {
            itemsArray.push({
                content: (
                    <Item 
                        bonusProduct={item}
                    />
                )
            })
        })

        setItemsBonusProducts(itemsArray)
    }, [allBonusProducts])

    console.log(itemsBonusProducts)

    const onSort = () => {}

	return(
        <List>
            <DragSortableList items={itemsBonusProducts} onSort={onSort} type='vertical' />
        </List>
    )
}

const Item = ({ bonusProduct }) => {
    console.log('bonusProduct', bonusProduct)

    return(
       <ListItem
            secondaryAction={
                <>
                    <IconButton
                        edge ="start"
                        className='edit-icon'
                        aria-label="edit"
                        // onClick={() => editProduct(product, imageUrl)}
                    >
                        <EditIcon /> 
                    </IconButton>
                    <IconButton
                        edge="end"
                        className='delete-icon'
                        aria-label="delete"
                        // onClick={() => deleteProduct(product)}
                    >
                        <DeleteIcon /> 
                    </IconButton>
                </>
            }
        >
  
            <ListItemText
                primary={<div className='title-div'>{bonusProduct.title}{bonusProduct.price > 0 && <span className='format-icon'>${bonusProduct.price}</span>}</div>}
                // secondary={product.description}
            />
            <div className='form-group-checkbox'>
                <div className='form-checkbox'>
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Visible"
                        checked={bonusProduct.visible}
                        // onChange={(e) => updateForCheckbox(product, { visible: e.target.checked })}
                    />
                </div>
                <div className='form-checkbox'>
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Está disponible"
                        checked={bonusProduct.disponibility}
                        // onChange={(e) => updateForCheckbox(product, { stock: e.target.checked })}
                    />
                </div>
            </div>
        </ListItem>
    )
}

export default ListBonusProducts