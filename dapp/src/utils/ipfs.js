export const getJSONData = async (cid) => {
    const res = await fetch( `https://gateway.pinata.cloud/ipfs/${cid}`)
    return res.json();
}

export const getCidFrom = (url) => url.replace('ipfs://', '')