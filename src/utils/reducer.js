import { configureStore, createSlice } from '@reduxjs/toolkit'

// 使用 createSlice 整合 reducer 與 action creators，取代分散的 userAction.js
const authSlice = createSlice({
  name: 'index',
  initialState: {
    authenticated: false,
    user: '',
    email: '',
    role: ''
  },
  reducers: {
    // 登入成功：寫入使用者資訊
    loginSuccess (state, action) {
      state.authenticated = true
      state.user = action.payload.user
      state.email = action.payload.email
      state.role = action.payload.role
    },
    // 登入失敗或登出：清除使用者資訊
    loginError (state) {
      state.authenticated = false
      state.user = ''
      state.email = ''
      state.role = ''
    }
  }
})

export const { loginSuccess, loginError } = authSlice.actions

const store = configureStore({
  reducer: {
    index: authSlice.reducer
  }
})

export default store
