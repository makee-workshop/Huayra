const header = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded'
})

export async function get (uri) {
  const request = fetch(uri,
    { credentials: 'include', mode: 'cors' })
    .then(r => r.json())
    .catch(e => {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。',
        errors: []
      }
    })

  return request
}

export async function post (uri, data) {
  const urlParams = new URLSearchParams(data)

  const sentData = {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    header: header,
    body: urlParams
  }

  const request = await fetch(uri, sentData)
    .then(r => r.json())
    .catch(e => {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。',
        errors: []
      }
    })

  return request
}

export async function put (uri, data) {
  const urlParams = new URLSearchParams(data)

  const sentData = {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    header: header,
    body: urlParams
  }

  const request = await fetch(uri, sentData)
    .then(r => r.json())
    .catch(e => {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。',
        errors: []
      }
    })

  return request
}

export async function deleteItem (uri) {
  const sentData = {
    method: 'DELETE',
    credentials: 'include',
    mode: 'cors'
  }

  const request = fetch(uri, sentData)
    .then(r => r.json())
    .catch(e => {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。',
        errors: []
      }
    })

  return request
}
