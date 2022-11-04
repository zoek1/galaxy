import React, {useContext} from 'react'
import Navbar from '../components/Navbar'
import ViewCampaign from '../components/ViewCampaign'
import Context from "../context";
import config from "../config";

function CampaignPage(props){
  const {address, onLogin, onLogout, balance } = useContext(Context);

  return(
    <div>
      <Navbar address={address} onLogin={onLogin} onLogout={onLogout}/>
      <div className="container containerCampaign">
        <div className="d-flex justify-content-center">
          <h2>Subtitle</h2>
        </div>
        <div className="viewCard d-flex flex-wrap justify-content-center">
          <ViewCampaign/>
        </div>
        <div className="d-flex justify-content-center">
          <h2>Subtitle 2</h2>
        </div>
        <div className="viewCard d-flex flex-wrap justify-content-center">
          <ViewCampaign/>
        </div>
      </div>
    </div>

  )
}

export default CampaignPage;
