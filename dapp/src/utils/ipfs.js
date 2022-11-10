import {Web3Storage} from "web3.storage";
import config from "../config";

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export const getJSONData = async (cid) => {
    const client = new Web3Storage({ token: config.WEB3_STORAGE });
    const res = await client.get(cid);
    const files = await res.files();

    const ab = await files[0].arrayBuffer();
    const text = ab2str(ab);

    console.log(text)
    return JSON.parse(text);

}

export const getCidFrom = (url) => url.replace('ipfs://', '')