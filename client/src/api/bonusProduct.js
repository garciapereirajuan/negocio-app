import { basePath, apiVersion } from './config'

export const showBonusProductApi = () => {
    const url = `${basePath}/${apiVersion}/bonus-products`

    return fetch(url)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}