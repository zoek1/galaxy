import React, {useContext, useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import IntegrationButton from '../components/IntegrationButton'
import {Link, useNavigate, useParams} from "react-router-dom";
import {get_campaign, get_campaigns} from "../utils/contract";
import Context from "../context";
import context from "../context";
import BigNumber from "bignumber.js";
import {getCidFrom, getJSONData} from "../utils/ipfs";

const Fields = [
  {
    id: 1,
    name: 'Discord',
    image: 'bi bi-discord',
    integration_action: 'link_account',
  },
  {
    id: 2,
    name: 'Join Telegram',
    image: 'bi bi-telegram',
    integration_action: 'link_account',
  },
  {
    id: 3,
    name: 'Suscribe Newsletter',
    image: 'bi bi-newspaper',
    integration_action: 'link_account',
  },
  {
    id: 4,
    name: 'What do you thing?',
    image: 'bi bi-question',
    integration_action: 'ask_question',
  },
  {
    id: 5,
    name: 'Select option',
    image: 'bi bi-question',
    integration_action: 'select_option',
  }
]

function ViewCampaignPage (props){
  const {ready, address} = props;
  console.log(props)
  const [campaign, setCampaign] = useState(null);
  const [campaignData, setCampaignData] = useState({})
  const [rewards, setRewards] = useState(0);
  const [integrations, setIntegrations] = useState([])
  const context = useContext(Context)

  const navigate = useNavigate();
  let { campaignId } = useParams();


  useEffect( () => {
    if (ready && context.contract) {
      get_campaign(context.address, context.contract, campaignId).then((campaign) => {
        setCampaign(campaign);

        if (campaign && campaign.activity) {
          const arr = [...campaign.activity.valueMap].map(([key, value]) => !value.claimed ? value.earned : 0 )
          setRewards(BigNumber.sum.apply(null, arr).toString());
        }

        const tuples = [...campaign.integrations.entries()]
        const integrations = tuples.map((t) => ({
          integrationId: t[0],
          amount: t[1]
        }))
        setIntegrations(integrations)
    });
    }
  }, [context.contract, address]);

  useEffect(() => {
    if (!campaign) return;

    // const cid = getCidFrom(campaign.metadata_url);
    const cid = "Qmf6RBKw8XCMCfAjSFd126G7oLuwfAwiR7uTAPdhkiGqDE"
    getJSONData(cid).then(data => setCampaignData(data)).catch(e => console.log(e))

  }, [campaign])
  console.log(campaignData)
  console.log(campaign);



  return(
    <div>
      <Navbar/>
      <h2 className="text-center mt-5">{ campaign && campaign.name ?  campaign.name : ''}</h2>
      {  address !== '' ?
        <button className="btn btn-outline-success">
          Redeem ${rewards}  LYT
        </button>
      : <></> }
      <div className="view container d-flex flex-column align-items-center justify-content-center h-100">
        { integrations && campaignData.integrations ?
          integrations.map(field =>(
            <div key={field.id}>
            { (field.integrationId.match(/ASK_QUESTION/)) &&
                <IntegrationButton id={field.integrationId}
                                   name={campaignData.integrations[field.integrationId].question}
                                   imageIcon='bi bi-question'
                                   reward={field.amount}
                                   rewarded={campaign.activity && campaign.activity.get(field.integrationId) !== undefined}
                                   onClick={ () => navigate(`/campaign/${campaignId}/think`) }
                /> ||
              (field.integrationId.match(/CHOOSE_OPTION/)) &&
                <IntegrationButton id={field.integrationId}
                                   name={campaignData.integrations[field.integrationId].question}
                                   imageIcon='bi bi-question'
                                   reward={field.amount}
                                   rewarded={campaign.activity && campaign.activity.get(field.integrationId) !== undefined}
                                   onClick={ () => navigate(`/campaign/${campaignId}/select`) }
                /> ||
              (field.integrationId.match(/DISCORD_JOIN_CHANNEL/)) &&
                <IntegrationButton id={field.integrationId}
                                   name={"Join us on Discord"}
                                   imageIcon='bi bi-discord'
                                   reward={field.amount}
                                   rewarded={campaign.activity && campaign.activity.get(field.integrationId) !== undefined}
                /> ||
              (field.integrationId.match(/TWITTER_FOLLOW/)) &&
                <IntegrationButton id={field.integrationId}
                                   name={`Follow ${campaignData.integrations[field.integrationId].screen_name} on twitter `}
                                   imageIcon='bi bi-twitter'
                                   reward={field.amount}
                                   rewarded={campaign.activity && campaign.activity.get(field.integrationId) !== undefined}
                />
              || <IntegrationButton id={field.integrationId} name={field.name} imageIcon={field.image}/>
            }

            </div>
          )) : <></>
        }
      </div>
    </div>
  )
}

export default ViewCampaignPage;
