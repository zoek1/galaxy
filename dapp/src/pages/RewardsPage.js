import React, {useContext, useEffect, useState} from 'react'
import Context from "../context";
import CardReward from '../components/CardReward';
import Navbar from '../components/Navbar'
import config from "../config";
import {getCampaigns, getRewards} from "../utils/contract";
import {getRewardsFromCache} from "../utils/request";
import {getCidFrom, getJSONData} from "../utils/ipfs";

function RewardsPage(props){
  const {address, onLogin, onLogout, balance, contract } = useContext(Context);
  const [rewards, setRewards] = useState([])
  const retrieveRewards = async (c) => {
      const rewards = await getRewards(contract.current);
      console.log(rewards);
      const data = [...rewards.entries()].map(async ([id, reward]) => {
        if (!c[id]) return null;
        console.log(c[id].ipfs)
        const cid = getCidFrom(c[id].ipfs);
        try {
            const data  = await getJSONData(cid);
            console.log(data);
            return {
                id: id,
                campaign: data['campaign'],
                cost: data['cost'],
                existence: data['existence'],
                redeemed: reward[1],
                name: data['name'],
                owner: data['owner'],
                thumbnail: getCidFrom(data['thumbnail'])
            }
        } catch (e) {
            console.log(e)
        }
        return null;

      });

      const validRewards = (await Promise.all(data)).filter(c => c !== null)
      setRewards(validRewards)
  };
  const onRefresh = async () => {
      const c = await getRewardsFromCache();
      console.log(c)
      await retrieveRewards(c);
  }
  useEffect(() => {

      onRefresh();
  }, [props.ready])
  return(
    <div>
      <Navbar address={address} onLogin={onLogin} onLogout={onLogout}/>
      <div className="container containerCampaign">
        <div className="d-flex justify-content-center">
          <h2>Rewards</h2>
        </div>
        <div className="viewCard d-flex flex-wrap justify-content-center">
            {
                rewards.map(reward => <CardReward onRefresh={onRefresh} address={address} reward={reward} />)
            }
        </div>
      </div>
    </div>
  )
}

export default RewardsPage;
