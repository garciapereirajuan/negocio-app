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

export const editBonusProductApi = (token, bonusProductId, bonsuProductData) => {}