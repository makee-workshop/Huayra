import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess, loginError } from './reducer'

export function requireWeakAuth (Component) {
  const AuthenticatedComponent = (props) => {
    const dispatch = useDispatch()

    useEffect(() => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          // Base64url → Base64 → Uint8Array → UTF-8 字串，取代已廢棄的 escape()
          const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
          const jwtPayload = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0))))
          if (jwtPayload._id && jwtPayload.roles.account) {
            const role = jwtPayload.roles.admin ? 'admin' : 'account'
            dispatch(loginSuccess({
              authenticated: true,
              user: jwtPayload.username,
              email: jwtPayload.email,
              role
            }))
          } else {
            localStorage.removeItem('token')
            dispatch(loginError())
          }
        }
      } catch (_error) {
        localStorage.removeItem('token')
        dispatch(loginError())
      }
    }, [dispatch])

    return <Component {...props} />
  }

  return AuthenticatedComponent
}
