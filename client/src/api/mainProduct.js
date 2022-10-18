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
        headers: {
            Authorization: token
        },
        body: formData
    }

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

export const showMainProductApi = async() => {
    const url = `${basePath}/${apiVersion}/main-products`

    return fetch(url)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}