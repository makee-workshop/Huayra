import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess, loginError } from './reducer'

export function requireAuthentication (Component) {
  const AuthenticatedComponent = (props) => {
    const dispatch = useDispatch()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
      const loginErrorHandler = () => {
        dispatch(loginError())
        const path = window.location.pathname
        if (path === '/') {
          window.location.assign('/login')
        } else {
          const search = window.location.search
          const returnUrl = search
            ? `/login?returnUrl=${path}&${search.substr(1)}`
            : `/login?returnUrl=${path}`
          window.location.assign(returnUrl)
        }
      }

      try {
        const token = localStorage.getItem('token')
        if (token) {
          // Base64url → Base64 → Uint8Array → UTF-8 字串，取代已廢棄的 escape()
          const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
          const jwtPayload = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0))))
          if (!jwtPayload._id || !jwtPayload.roles.account) {
            loginErrorHandler()
          } else {
            const role = jwtPayload.roles.admin ? 'admin' : 'account'
            dispatch(loginSuccess({
              authenticated: true,
              user: jwtPayload.username,
              email: jwtPayload.email,
              role
            }))
            setIsAuthenticated(true)
          }
        } else {
          loginErrorHandler()
        }
      } catch (_error) {
        loginErrorHandler()
      }
    }, [dispatch])

    if (!isAuthenticated) return null
    return <Component {...props} />
  }

  return AuthenticatedComponent
}
