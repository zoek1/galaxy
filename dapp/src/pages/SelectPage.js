import React, {useContext, useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import Context from "../context";
import {useNavigate, useParams} from "react-router-dom";
import {get_campaign} from "../utils/contract";
import {jsonGet, jsonPost} from "../utils/request";
import {getCidFrom, getJSONData} from "../utils/ipfs";

const Options = [
  {
    id: 1,
    option: "One",
  },
  {
    id: 2,
    option: "Two",
  },
  {
    id: 1,
    option: "Three",
  }
]

function SelectPage (props) {
  const {ready, address} = props;
  const [campaign, setCampaign] = useState(null);
  const [campaignData, setCampaignData] = useState({})
  const [integrations, setIntegrations] = useState([])
  const [cache, setCache] = useState({});
  const [deactivate, setDeactivate] = useState(false)
  const [response, setResponse] = useState('');
  const context = useContext(Context)
  const navigate = useNavigate();
  let { campaignId, integrationId } = useParams();

  const retrieveCampaign = async () => {
      const campaign = await get_campaign(context.address, context.contract.current, campaignId);

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
    console.log(data)

    if (data && data.activity && data.activity[integrationId])
      setResponse(data.activity[integrationId].data.response)
  }

  useEffect( () => {
    if (ready && context.contract.current) {
      retrieveCampaign();
    }
  }, [context.contract.current, address]);


  useEffect(() => {
    if (!campaign) return;

    const cid = getCidFrom(campaign.metadata_url);
    getJSONData(cid).then(data => {
      setCampaignData(data);
    }).catch(e => console.log(e))


  }, [campaign])

  const onRedeem = async () => {
    setDeactivate(true)
    try {
      const address = await context.onLogin();
      const res = await jsonPost(`/s/check_question_reward/${campaignId}/${integrationId}`, {
        response,
        address,
      });
      updateCacheFromServer();
      alert(res.msg);
    } catch(e) {
      alert(e)
    }

    setDeactivate(false);
  }

  const onSend = async () => {
    if (response.trim() !== '') {
      return await onRedeem();
    }

    alert('Empty Strings not allowed');
  }

  const done =  cache.activity && cache.activity[integrationId] ? cache.activity[integrationId].approved : false;
  const options = campaignData?.integrations ? campaignData?.integrations[integrationId]?.options : []
  return(
    <div>
      <Navbar/>
      <div className="container">
        <div className="selectPage d-flex flex-column align-items-center justify-content-center h-100">
          <div className="title mt-5">
            <h2>{campaignData?.integrations ? campaignData?.integrations[integrationId]?.question : ''}</h2>
          </div>
          <div className="mt-2">
          {
            options.map(op =>(
              <div className="mt-3  fs-4 form-check ">
                <input onClick={(e) => setResponse(e.target.id)}
                       className="form-check-input"
                       name="flexRadioDefault"
                       type="radio"
                       value=""
                       checked={op === response}
                       id={op}/>
                <label className="form-check-label" htmlFor={op}>
                  {op}
                </label>
              </div>
            ))
          }
          </div>

        </div>
        <div className="buttonSend d-flex justify-content-end">
          <button onClick={() => navigate(`/campaign/${campaignId}`)} className="btn btn-link">Back to Campaign</button>
          <button onClick={onSend} className="btn btn-primary " disabled={deactivate || done}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default SelectPage;
