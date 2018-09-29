export const loginSuccess = user => ({
  type: 'LOGIN_SUCCESS_USER',
  user: user
})

export const loginError = () => ({
  type: 'LOGIN_ERROR_USER'
})
