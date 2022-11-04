import React, {useContext} from 'react'
import Context from "../context";
import CardReward from '../components/CardReward';
import Navbar from '../components/Navbar'
import config from "../config";
import {Link} from "react-router-dom";

function RewardsPage(props){
  const {address, onLogin, onLogout, balance } = useContext(Context);

  return(
    <div>
      <Navbar address={address} onLogin={onLogin} onLogout={onLogout}/>
      <div className="container containerCampaign">
        <div className="d-flex justify-content-center">
          <h2>Rewards</h2>
        </div>
        <div className="viewCard d-flex flex-wrap justify-content-center">
          <CardReward/>
        </div>
      </div>
    </div>
  )
}

export default RewardsPage;
