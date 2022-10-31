import { basePath, apiVersion } from './config'

export const showBonusProductApi = () => {
    const url = `${basePath}/${apiVersion}/bonus-products`

    return fetch(url)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const addBonusProductApi = (token, bonusProductData) => {
    const url = `${basePath}/${apiVersion}/bonus-product`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(bonusProductData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const updateBonusProductApi = (token, bonusProductId, bonusProductData) => {
    const url = `${basePath}/${apiVersion}/bonus-product/${bonusProductId}`
    const params = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(bonusProductData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const updateBonusProductSpecialApi = (token, bonusProductId, bonusProductData) => {
    const url = `${basePath}/${apiVersion}/bonus-product-checkbox-and-order/${bonusProductId}`
    const params = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(bonusProductData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const removeBonusProductApi = (token, bonusProductId) => {
    const url = `${basePath}/${apiVersion}/bonus-product/${bonusProductId}`
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

export const editBonusProductApi = (token, bonusProductId, bonsuProductData) => {}