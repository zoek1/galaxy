import React from 'react'
import {getCidFrom} from "../utils/ipfs";
import {v4 as uuidv4} from "uuid";
import {fileToIPFS, jsonToIPFS, saveReward} from "../utils/request";
import {Schema} from "@taquito/michelson-encoder";
import {addReward, redeemReward} from "../utils/contract";

function CardReward(props){
  const {
    id,
    name,
    campaign,
    cost,
    existence,
    redeemed,
    owner,
    thumbnail
  } = props.reward;
  const {address, onRefresh} = props;

   const onRedeem = async () => {
    if (!address) {
        alert("Requires Login");
        return;
    }

    const res = await redeemReward(id);
    if (res) {
      alert('Your redeem request is submitted, wait until it being mined!')
      await onRefresh()
    }
  }

  return(
  <div className="card cardReward">
    <img src={`https://${thumbnail}.ipfs.w3s.link`} className="card-img-top"/>
    <div className="card-body">
      <h5 id={id} className="card-title">Reward</h5>
      <p className="card-text">{name}</p>
      <div className="d-flex d-inline-flex">
        <div className="d-flex row justify-content-start">
          <h5 className="card-title">Existence</h5>
          <p className="card-text">{redeemed.toString()} / {existence}</p>
        </div>
        <div className="d-flex row justify-content-end">
          <h5 className="card-title">Cost</h5>
          <p className="card-text">{cost}</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onRedeem} disabled={redeemed.toString() === '0'}>Buy</button>
    </div>
  </div>
  )
}

export default CardReward;
