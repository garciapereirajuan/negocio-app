import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Button } from '@mui/material'
import { getAccessTokenApi } from '../../../api/auth'
import { updateCategoryOrderApi } from '../../../api/categories'
import DragSortableList from 'react-drag-sortable'

const ListCategories = ({ allCategories }) => {
    const [itemsCategories, setItemsCategories] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const itemsArray = []

        allCategories && allCategories.forEach(category => {
            itemsArray.push({
                content: (
                    <CategoryButton 
                        category={category}
                        editCategory={editCategory}
                    />
                )  
            })
        })

        setItemsCategories(itemsArray)
    }, [allCategories])

    const onSort = (sortedList) => {
        const token = getAccessTokenApi()

        sortedList.forEach(item => {
            const order = item.rank
            const categoryId = item.content.props.category._id

            updateCategoryOrderApi(token, categoryId, { order })
                .then(response => console.log(response))

        })
    }

    const editCategory = (category) => {
        const categoryData = JSON.stringify(category)

        navigate(`/admin/category?data=${categoryData}`)
    }

    return (
        <List style={{userSelect: "none"}}>
            <DragSortableList items={itemsCategories} onSort={onSort} dropBackTransitionDuration={0.3} type="vertical" />
        </List> 
    )
}

const CategoryButton = ({ category, editCategory }) => {
    return (
        <Button 
            style={{color: "#e2e2e2"}}
            onClick={() => editCategory(category)}
        >
            {category.title}
        </Button>
    )
}

export default ListCategories
