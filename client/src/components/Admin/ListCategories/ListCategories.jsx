import React, { useState, useEffect } from 'react'
import { List, Button } from '@mui/material'
import DragSortableList from 'react-drag-sortable'

const ListCategories = ({ allCategories }) => {
    const [itemsCategories, setItemsCategories] = useState([])

    useEffect(() => {
        const itemsArray = []

        allCategories.forEach(category => {
            itemsArray.push({
                content: <Button>{category.title}</Button>
            })
        })

        setItemsCategories(itemsArray)
    }, [allCategories])

    const onSort = () => {}
    console.log(allCategories)

    return (
        
            <List>
                <DragSortableList items={itemsCategories} onSort={onSort} dropBackTransitionDuration={0.3} type="vertical" />
            </List> 
        
    )
}

export default ListCategories
