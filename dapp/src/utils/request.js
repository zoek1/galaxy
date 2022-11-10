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

export const jsonToIPFS = async (body) => {
    const res = await fetch('/s/ipfs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    return await res.json();
}

export const saveCampaign = async (body) => {
    const res = await fetch('/s/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    return await res.json();
}

export const getCampaignsFromCache = async () => {
    const res = await fetch('/s/campaigns');
    return await res.json();
}