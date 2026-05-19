import axios from 'axios'

// 建立 axios 實例，統一啟用 withCredentials 支援 cookie 跨域請求
const http = axios.create({ withCredentials: true })

// 從 localStorage 取得 JWT token 並組成 Authorization header
function getHeader () {
  const token = localStorage.getItem('token')
  if (!token) return {}
  return { headers: { Authorization: `Bearer ${token}` } }
}

// 統一的錯誤處理：401 時清除 token 並跳轉登入頁
function handleError (error) {
  console.error(error)
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    const returnUrl = window.location.pathname !== '/login'
      ? `?returnUrl=${window.location.pathname}`
      : ''
    window.location.assign(`/login${returnUrl}`)
  }
  return { success: false, error: '資料連線出現錯誤。', errors: [], data: null }
}

export async function get (uri) {
  try {
    const res = await http.get(uri, getHeader())
    return res.data
  } catch (e) {
    return handleError(e)
  }
}

export async function post (uri, data) {
  try {
    const res = await http.post(uri, data, getHeader())
    return res.data
  } catch (e) {
    return handleError(e)
  }
}

export async function put (uri, data) {
  try {
    const res = await http.put(uri, data, getHeader())
    return res.data
  } catch (e) {
    return handleError(e)
  }
}

export async function deleteItem (uri) {
  try {
    const res = await http.delete(uri, getHeader())
    return res.data
  } catch (e) {
    return handleError(e)
  }
}
