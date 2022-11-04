import React, {useContext, useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import IntegrationButton from '../components/IntegrationButton'
import {Link, useNavigate, useParams} from "react-router-dom";
import {get_campaign, get_campaigns, redeem} from "../utils/contract";
import Context from "../context.js";
import config from "../config.js";
import BigNumber from "bignumber.js";
import {getCidFrom, getJSONData} from "../utils/ipfs";
import {jsonGet, jsonPost} from "../utils/request";


function ViewCampaignPage (props){
  const {ready, address} = props;
  const [campaign, setCampaign] = useState(null);
  const [auths, setAuths] = useState({twitter: false, discord: false})
  const [campaignData, setCampaignData] = useState({})
  const [rewards, setRewards] = useState(0);
  const [deactivate, setDeactivate] = useState({})
  const [integrations, setIntegrations] = useState([])
  const [cache, setCache] = useState({});
  const context = useContext(Context)
  const navigate = useNavigate();
  let { campaignId } = useParams();

  useEffect(() => {
    const _ = async () => {
      const res = await fetch('/s/authenticated')
      const data = await res.json();

      if (data.twitter !== auths.twitter || data.discord !== auths.discord) {
        setAuths(data);
      }
    }
    _();
  }, [auths.twitter, auths.discord]);

  const retrieveCampaign = async () => {

      const campaign = await get_campaign(context.address, context.contract.current, campaignId);

      if (campaign && campaign.activity) {
        const arr = [...campaign.activity.valueMap].map(([key, value]) => !value.claimed ? value.earned : 0 )
        setRewards(BigNumber.sum.apply(null, arr).toString());
      }

      const tuples = [...campaign.integrations.entries()]
      const integrations = tuples.map((t) => ({
        integrationId: t[0],
        amount: t[1]
      }))


      setCampaign(campaign);
      setIntegrations(integrations)
      updateCacheFromServer();
  };

  const updateCacheFromServer = async () => {
    const data = await jsonGet(`/s/cache/${campaignId}`, {
      address
    });
    setCache(data)
  }

  useEffect( () => {
    if (ready && context.contract.current) {
      retrieveCampaign();
    }
  }, [context.contract.current, address]);

  useEffect(() => {
    if (!campaign) return;

    const cid = getCidFrom(campaign.metadata_url);
    getJSONData(cid).then(data => setCampaignData(data)).catch(e => console.log(e))

  }, [campaign])

  const onRedeem = (integrationId) => async (event) => {
    setDeactivate({...deactivate, [integrationId]: true})
    const response = await redeem( campaignId, integrationId, context.Tezos.current)
    try {
      await jsonPost(`/s/redeem/${campaignId}/${integrationId}`, {
        tx: response['transactionHash'],
        address,
      });
      updateCacheFromServer();
    } catch(e) {
      alert(e)
    }

    setDeactivate({...deactivate, [integrationId]: undefined})
  }

  const twitterOnClick = (integrationId) => () => {
    const screen_name = campaignData.integrations[integrationId].screen_name.replace('@', '');
    window.location.href = `https://twitter.com/${screen_name}`;
  }

  const discordOnClick = (integrationId) => () => {
    const invitation_link = campaignData.integrations[integrationId].invitation_link;
    window.location.href = invitation_link;
  }

  const twitterCheck = (integrationId) => async (event) => {
    event.stopPropagation();
    setDeactivate({...deactivate, [integrationId]: true})

    if (!auths.twitter) {
       window.location.href = `${config.DOMAIN}/s/twitter/${campaignId}`
    }

    if (!address) {
      alert('Log in to check rewards');
      setDeactivate({...deactivate, [integrationId]: false})
      return;
    }

    try {
      const data = await jsonPost(`/s/check_twitter_reward/${campaignId}/${integrationId}`, {
        address
      })
      alert(data.msg);
      await retrieveCampaign();
    } catch (e) {
      alert(e)
    }

    setDeactivate({...deactivate, [integrationId]: undefined})

  }
  console.log('==================')
  console.log(campaign)
  console.log(campaignData)
  console.log(cache)
  console.log('==================')
  const discordCheck = (integrationId) => async (event) => {
    event.stopPropagation();
    setDeactivate({...deactivate, [integrationId]: true})

    if (!address) {
      alert('Log in to check rewards');
      setDeactivate({...deactivate, [integrationId]: false})
      return;
    }

    if (!auths.discord) {
       window.location.href = `${config.DOMAIN}/s/discord/${campaignId}?${address}`
    }

    try {
      const data = await jsonPost(`/s/check_discord_reward/${campaignId}/${integrationId}`, {
        address
      })
      alert(data.msg);
      await retrieveCampaign();
    } catch (e) {
      console.log(e)
    }
    setDeactivate({...deactivate, [integrationId]: undefined})
  }

  const isRewarded = (integrationId) => {
    if (campaign.activity) {
      const rewardOnProcess = cache.activity && cache.activity[integrationId]?.redeemed;
      const rewardClaimed = campaign.activity.get(integrationId) &&
                            campaign.activity.get(integrationId).claimed;

      return rewardClaimed || rewardOnProcess;
    }

    return false;
  }

  const isReadyToClaim = (integrationId) => {
    if (campaign.activity) {
       return campaign.activity.get(integrationId) !== undefined
    }

    return false;
  }

  const needWaitUntilMining = (integrationId) => {
    if (cache.activity) {
      const integration = cache.activity[integrationId];
      return integration?.approved && !integration?.redeemed;
    }
    return false;
  }

  return(
    <div>
      <Navbar/>
      <h2 className="text-center mt-5">{ campaign && campaign.name ?  campaign.name : ''}</h2>
      <div className="view container d-flex flex-column align-items-center justify-content-center h-100">
        { integrations && campaignData.integrations ?
          integrations.map(field =>(
            <div key={field.id}>
            { (field.integrationId.match(/ASK_QUESTION/)) &&
                <IntegrationButton id={field.integrationId}
                                   name={campaignData.integrations[field.integrationId].question}
                                   imageIcon='bi bi-question'
                                   reward={field.amount}
                                   rewarded={isRewarded(field.integrationId)}
                                   claim={ isReadyToClaim(field.integrationId) }
                                   onRedeem={onRedeem(field.integrationId)}
                                   onClick={ () => navigate(`/campaign/${campaignId}/question/${field.integrationId}`) }
                                   deactivated={deactivate[field.integrationId] ||
                                                (!isReadyToClaim(field.integrationId) &&
                                                  needWaitUntilMining(field.integrationId))}
                /> ||
              (field.integrationId.match(/CHOOSE_OPTION/)) &&
                <IntegrationButton id={field.integrationId}
                                   name={campaignData.integrations[field.integrationId].question}
                                   imageIcon='bi bi-question'
                                   reward={field.amount}
                                   rewarded={isRewarded(field.integrationId)}
                                   claim={isReadyToClaim(field.integrationId)}
                                   onRedeem={onRedeem(field.integrationId)}
                                   onClick={ () => navigate(`/campaign/${campaignId}/select/${field.integrationId}`) }
                                   deactivated={deactivate[field.integrationId] ||
                                                (!isReadyToClaim(field.integrationId) &&
                                                  needWaitUntilMining(field.integrationId))}
                /> ||
              (field.integrationId.match(/DISCORD_JOIN_CHANNEL/)) &&
                <IntegrationButton id={field.integrationId}
                                   name={"Join us on Discord"}
                                   imageIcon='bi bi-discord'
                                   reward={field.amount}
                                   onRedeem={onRedeem(field.integrationId)}
                                   rewarded={isRewarded(field.integrationId)}
                                   claim={isReadyToClaim(field.integrationId)}
                                   onClick={discordOnClick(field.integrationId)}
                                   onCheck={discordCheck(field.integrationId)}
                                   deactivated={deactivate[field.integrationId] ||
                                                (!isReadyToClaim(field.integrationId) &&
                                                  needWaitUntilMining(field.integrationId))}
                /> ||
              (field.integrationId.match(/TWITTER_FOLLOW/)) &&
                <IntegrationButton id={field.integrationId}
                                   name={`Follow ${campaignData.integrations[field.integrationId].screen_name} on twitter `}
                                   imageIcon='bi bi-twitter'
                                   reward={field.amount}
                                   onRedeem={onRedeem(field.integrationId)}
                                   rewarded={isRewarded(field.integrationId)}
                                   claim={isReadyToClaim(field.integrationId)}
                                   onClick={twitterOnClick(field.integrationId)}
                                   onCheck={twitterCheck(field.integrationId)}
                                   deactivated={deactivate[field.integrationId] ||
                                                (!isReadyToClaim(field.integrationId) &&
                                                  needWaitUntilMining(field.integrationId))}
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
