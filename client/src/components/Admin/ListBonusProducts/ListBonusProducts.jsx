import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, ListItem, IconButton, ListItemText, FormControlLabel, Checkbox, Button, Alert } from '@mui/material'
import DragSortableList from 'react-drag-sortable'
import { getAccessTokenApi } from '../../../api/auth'
import { updateBonusProductSpecialApi, removeBonusProductApi } from '../../../api/bonusProduct'
import DialogMui from '../../DialogMui'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import './ListBonusProducts.css'

const ListBonusProducts = ({ allBonusProducts, setReloadAllBonusProducts }) => {
	const [itemsBonusProducts, setItemsBonusProducts] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [titleDialog, setTitleDialog] = useState('')
    const [contentDialog, setContentDialog] = useState(null)
    const [actionsDialog, setActionsDialog] = useState(null)
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
        const messageAboutBonusColor = localStorage.getItem('messageAboutBonusColor')

        if (!messageAboutBonusColor) {
            return
        }

        setTimeout(() => setAlert([]), 10000)
    }, [alert])

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

    const deleteBonusProduct = (product) => {

        const cancelDelete = () => {
            setOpenDialog(false)
        }
        const confirmDelete = () => {
            const token = getAccessTokenApi()

            removeBonusProductApi(token, product._id)
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
                    setOpenDialog(false)
                    setReloadAllBonusProducts(true)
                })
                .catch(err => {
                    setAlert(['error', 'Ocurrió un error en el servidor, intenta más tarde.'])
                })
        }

        setOpenDialog(true)
        setTitleDialog('Eliminando complemento...')
        setContentDialog(
            <div style={{display: 'flex'}}>
                <div style={{marginRight: '4px'}}>¿Quieres eliminar el complemento</div>
                <div className='title-capitalize'>
                    <strong>{product.option} {product.title}</strong>?
                </div>
            </div>
        )
        setActionsDialog(
            <>
                <Button
                    onClick={cancelDelete}
                >
                    Cancelar
                </Button>   
                <Button
                    style={{color: 'red'}}
                    onClick={confirmDelete}
                >
                    Eliminar
                </Button>
            </>
        )
    }

    const onSort = (sortedList) => {
        const token = getAccessTokenApi()
        console.log(sortedList)

        sortedList.map(item => {
            const productId = item.content.props.bonusProduct._id
            const order = item.rank

            updateBonusProductSpecialApi(token, productId, { order })
                .then(response => console.log(response))
        })
    }

	return(
        <>
            {alert.length !== 0 && <Alert severity={alert[0]}>{alert[1]}</Alert>}
            <List className='list-bonus-products'>
                <DragSortableList items={itemsBonusProducts} onSort={onSort} type='vertical' />
            </List>
            <DialogMui
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                titleDialog={titleDialog}
                contentDialog={contentDialog}
                actionsDialog={actionsDialog}
            />
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