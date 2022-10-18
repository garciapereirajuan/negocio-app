import { basePath, apiVersion } from './config'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../utils/constants'

export const addUserApi = async (userData) => {
    const url = `${basePath}/${apiVersion}/user`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const loginUserApi = async (userData) => {
    const url = `${basePath}/${apiVersion}/user/login`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}