import { basePath, apiVersion } from './config'

export const addMainProductApi = async(token, MainProductData) => {
    const url = `${basePath}/${apiVersion}/main-product`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(MainProductData)
    }

    return fetch(url, params) 
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const addMainProductImageApi = (token, mainProductId, image) => {
    const url = `${basePath}/${apiVersion}/main-product-image/${mainProductId}`

    const formData = new FormData()
    formData.append('image', image, image.name)

    const params = {
        method: 'PUT',
        body: formData,
        headers: {
            Authorization: token
        },
    }

    console.log(url, params)

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const showMainProductImageApi = (imageId) => {
    const url = `${basePath}/${apiVersion}/main-product-image/${imageId}`
    return fetch(url)
        .then(response => response.url)
        .catch(err => err)
}

export const showMainProductApi = async (mainProductsId) => {
    const url = `${basePath}/${apiVersion}/main-products`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mainProductsId: mainProductsId })
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const updateMainProductApi = async (token, mainProductId, mainProductData) => {
    const url = `${basePath}/${apiVersion}/main-product/${mainProductId}`
    const params = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(mainProductData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const updateMainProductSpecialApi = async (token, mainProductId, mainProductCheckbox) => {
    const url = `${basePath}/${apiVersion}/main-product-checkbox-and-order/${mainProductId}`
    const params = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(mainProductCheckbox)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const removeMainProductApi = async (token, mainProductId) => {
    const url = `${basePath}/${apiVersion}/main-product/${mainProductId}`
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