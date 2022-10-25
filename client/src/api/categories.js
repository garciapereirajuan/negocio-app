import { basePath, apiVersion } from './config'

export const addCategoryApi = async (token, categoryData) => {
    const url = `${basePath}/${apiVersion}/category`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(categoryData)        
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const showCategoriesApi = async () => {
    const url = `${basePath}/${apiVersion}/categories`

    return fetch(url)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const updateCategoryApi = async (token, categoryId, categoryData) => {
    const url = `${basePath}/${apiVersion}/category/${categoryId}`
    const params = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(categoryData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const updateCategoryOrderApi = async (token, categoryId, categoryData) => {
    const url = `${basePath}/${apiVersion}/category-order/${categoryId}`
    const params = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(categoryData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
} 

export const removeCategoryApi = async (token, categoryId) => {
    const url = `${basePath}/${apiVersion}/category/${categoryId}`
    const params = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        }
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}