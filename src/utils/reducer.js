import { configureStore } from '@reduxjs/toolkit'

const initialState = {
  index: {
    authenticated: false,
    user: '',
    email: '',
    role: ''
  }
}

// Reducer
function rootReducer (state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS_USER':
      return {
        ...state,
        index: { // 首頁
          authenticated: true, // 是否驗證
          user: action.user.user, // 使用者名稱
          email: action.user.email,
          role: action.user.role // 使用者權限
        }
      }
    case 'LOGIN_ERROR_USER':
      return {
        ...state,
        index: { // 首頁
          authenticated: false, // 是否驗證
          user: '', // 使用者名稱
          email: '',
          role: '' // 使用者權限
        }
      }
    default:
      return state
  }
}

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState
})

export default store
