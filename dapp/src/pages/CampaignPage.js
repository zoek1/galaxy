import React, {useContext, useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import ViewCampaign from '../components/ViewCampaign'
import Context from "../context";
import config from "../config";
import {useNavigate} from "react-router-dom";
import {getCampaigns} from "../utils/contract";
import BigNumber from "bignumber.js";
import {getCampaignsFromCache} from "../utils/request";

function CampaignPage(props){
  const {address, onLogin, onLogout, ready,  balance } = useContext(Context);
  const [campaigns, setCampaigns] = useState(null);
  const [cache, setCache] = useState({});
  const context = useContext(Context)
  const navigate = useNavigate();

  const retrieveCampaigns = async (campaignIds) => {
      const campaigns = await getCampaigns(context.contract.current, campaignIds);
      console.log(campaigns)
      setCampaigns([...campaigns.entries()])
  };

  useEffect(() => {
      const _ = async () => {
          const c = await getCampaignsFromCache();
          console.log(c)
          await retrieveCampaigns(Object.keys(c));
      }
      _();
  }, [props.ready])
    console.log(campaigns)
  return(
    <div>
      <Navbar address={address} onLogin={onLogin} onLogout={onLogout}/>
      <div className="container containerCampaign">
        <div className="d-flex justify-content-center">
          <h2>All campaigns</h2>
        </div>
        <div className="viewCard d-flex flex-wrap justify-content-center">
            {
                campaigns ? campaigns.map((entries) => {
                    const key=entries[0];
                    const campaign=entries[1]
                    return <ViewCampaign
                        id={key}
                        created={campaign.created}
                        deadline={campaign.deadline}
                        integrations={campaign.integrations}
                        metadata_url={campaign.metadata_url}
                        name={campaign.name}
                        owner={campaign.owner} />
                }) : <></>
            }

        </div>
      </div>
    </div>

  )
}

export default CampaignPage;
