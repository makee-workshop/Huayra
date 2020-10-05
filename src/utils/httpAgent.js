const axios = require('axios').create({
  withCredentials: true
})

function getHeader () {
  if (localStorage.getItem('token')) {
    return { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
  } else {
    return null
  }
}

function exception (error) {
  console.error(error)
  if (error.response.status === 401) {
    localStorage.removeItem('token')
    if (window.location.pathname === '/login') {
      window.location.assign('/login')
    } else {
      window.location.assign(`/login?returnUrl=${window.location.pathname}`)
    }
  }
  return {
    success: false,
    error: '資料連線出現錯誤。',
    errors: [],
    data: null
  }
}

export function get (uri) {
  const request = axios.get(uri, getHeader())
    .then(r => {
      return r.data
    })
    .catch(function (e) {
      return exception(e)
    })

  return request
}

export function post (uri, data) {
  const request = axios.post(uri, data, getHeader())
    .then(r => r.data)
    .catch(function (e) {
      return exception(e)
    })

  return request
}

export function put (uri, data) {
  const request = axios.put(uri, data, getHeader())
    .then(r => r.data)
    .catch(function (e) {
      return exception(e)
    })

  return request
}

export function deleteItem (uri) {
  const request = axios.delete(uri, getHeader())
    .then(r => r.data)
    .catch(function (e) {
      return exception(e)
    })

  return request
}
