import { createStore, compose } from 'redux'

const initialState = {
  index: { // 主要資訊
    authenticated: false, // 是否驗證
    user: '', // 使用者名稱
    email: '', // 使用者 email
    role: '' // 使用者權限
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

const enhancer = compose(
  // Middleware you want to use in development:
  // applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const store = createStore(rootReducer, initialState, enhancer)

export default store
