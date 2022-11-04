export const jsonPost = async (url, body) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

    return await res.json();
}

export const jsonGet = async (url, params) => {
    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    const res = await fetch(`${url}?${queryString}`)

    return await res.json();
}

export const jsonToPinata = async (url, body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    return await res.json();
}