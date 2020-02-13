const axios = require('axios').create({
  withCredentials: true
})

export function get (uri) {
  const request = axios.get(uri)
    .then(r => r.data)
    .catch(function (e) {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。',
        errors: []
      }
    })

  return request
}

export function post (uri, data) {
  const request = axios.post(uri, data)
    .then(r => r.data)
    .catch(function (e) {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。',
        errors: []
      }
    })

  return request
}

export function put (uri, data) {
  const request = axios.put(uri, data)
    .then(r => r.data)
    .catch(function (e) {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。',
        errors: []
      }
    })

  return request
}

export function deleteItem (uri) {
  const request = axios.delete(uri)
    .then(r => r.data)
    .catch(function (e) {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。',
        errors: []
      }
    })

  return request
}
