import { useState, useEffect, createContext } from 'react'
import { getAccessTokenApi, getRefreshTokenApi, refreshAccessTokenApi, logout } from '../api/auth'
import jwtDecode from 'jwt-decode'
import { FlashOnRounded } from '@mui/icons-material'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        user: null,
        isLoading: true
    })

    useEffect(() => {
        checkUserLogin(setUser)
    }, [])

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

const checkUserLogin = (setUser) => {
    const accessToken = getAccessTokenApi()

    if (!accessToken) {
        const refreshToken = getRefreshTokenApi()

        if (!refreshToken) {
            logout()
            setUser({ user: null, isLoading: false })
            return
        }

        refreshAccessTokenApi(refreshToken)
            .then(response => {
                if (!response.ok) {
                    setUser({ user: null, isLoading: false })
                    return
                }

                setUser({
                    user: jwtDecode(response.accessToken),
                    isLoading: false
                })
            })
        return
    }

    setUser({
        user: jwtDecode(accessToken),
        isLoading: false
    })
}

export default AuthProvider