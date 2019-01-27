const header = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded'
})

export async function get (uri) {
  let request = fetch(uri,
    { credentials: 'include', mode: 'cors' })
    .then(r => r.json())
    .then(r => {
      return (r)
    }).catch(e => {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。'
      }
    })

  return request
}

export async function post (uri, data) {
  let urlParams = new URLSearchParams(data)

  let sentData = {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    header: header,
    body: urlParams
  }

  let request = await fetch(uri, sentData)
    .then(r => r.json())
    .then(r => {
      return (r)
    }).catch(e => {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。'
      }
    })

  return request
}

export async function put (uri, data) {
  let urlParams = new URLSearchParams(data)

  let sentData = {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    header: header,
    body: urlParams
  }

  let request = await fetch(uri, sentData)
    .then(r => r.json())
    .then(r => {
      return (r)
    }).catch(e => {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。'
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

  let request = fetch(uri, sentData)
    .then(r => r.json())
    .then(r => {
      return (r)
    }).catch(e => {
      console.error(e)
      return {
        success: false,
        error: '資料連線出現錯誤。'
      }
    })

  return request
}
