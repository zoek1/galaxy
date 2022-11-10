import React, {useContext, useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import {addCampaign, getIntegrations} from "../utils/contract";
import Context from "../context";
import {Schema} from "@taquito/michelson-encoder";
import { v4 as uuidv4 } from 'uuid';
import config from "../config";
import {Link} from "react-router-dom";
import {jsonToIPFS, saveCampaign} from "../utils/request";


function NewCampaignPage (props){
  let {address, ready, onLogin, onLogout} = props;
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [integrations, setIntegrations] = useState([])
  const [activeIntegrations, setActiveIntegrations] = useState([])
  const [selectedIntegration, setSelectedIntegration] = useState("")
  const [disabled, setDisabled] = useState(false);
  const [tx, setTx] = useState('');
  const [campaign, setCampaign] = useState('')
  const context = useContext(Context)

  useEffect(() => {
    const _ = async () => {
      if (ready) {
        await context.onLogin();
        const integrations = await getIntegrations(context.contract.current)
        console.log(integrations);
        setIntegrations(integrations);
      }
    }
    _();
  }, [ready])

  const addIntegration = () => {
    const newIntegrations = integrations.filter(integration => integration.id !== selectedIntegration);
    const currentIntegration = integrations.filter(integration => integration.id === selectedIntegration);
    const newActiveIntegrations = [...activeIntegrations, ...currentIntegration];

    setIntegrations(newIntegrations);
    setActiveIntegrations(newActiveIntegrations);
  }

  const removeIntegration = (integrationId) => {
    const newActiveIntegrations = activeIntegrations.filter(integration => integration.id !== integrationId);
    const currentIntegration = activeIntegrations.filter(integration => integration.id === integrationId);
    const newIntegrations = [...integrations, ...currentIntegration];

    setIntegrations(newIntegrations);
    setActiveIntegrations(newActiveIntegrations);
  }

  const setValue = (index, value) => {
    const newActiveIntegrations = [...activeIntegrations];
    newActiveIntegrations[index].value = value

    setActiveIntegrations(newActiveIntegrations);
  }

  const setReward = (index, value) => {
    const newActiveIntegrations = [...activeIntegrations];
    const reward = Math.abs(parseInt(value));
    newActiveIntegrations[index].reward = reward || 1

    setActiveIntegrations(newActiveIntegrations);
  }

  const setOptions = (index, value) => {
    const newActiveIntegrations = [...activeIntegrations];
    newActiveIntegrations[index].options = value

    setActiveIntegrations(newActiveIntegrations);
  }
  console.log(activeIntegrations)

  const onSave = async () => {
    const campaignId = uuidv4();

    if (name.trim() === '')  { alert('Error: Name is empty'); return;}
    if (Date.now() >= new Date(deadline))  { alert('Error: Deadline should be in the future'); return;}
    if (!activeIntegrations.length)  { alert('Error: Requires at least one integrations'); return;}
    for (let i=0; i<activeIntegrations.length; i++) {
      console.log(activeIntegrations[i])
      if(activeIntegrations[i].value?.trim() === '' )  { alert('Error: Integration Title is empty'); return;}
      if(!activeIntegrations[i].reward)  { alert('Error: No reward specified'); return;}
      if(activeIntegrations[i].id.match(/CHOOSE_OPTION/) && !activeIntegrations[i].options.trim() === '')  {
        alert('Error: No options specified'); return;
      }
    }

    const metadata = {
        name: name,
        deadline: deadline.toString() + ':00Z', // "2023-01-01T10:10:10Z",
        integrations: activeIntegrations.reduce((prev, integration) => {

          if (integration.id === 'DISCORD_JOIN_CHANNEL') {
            prev[integration.id] = {
              "reward": integration.reward,
              "invitation_link": integration.value
            }
          }
          else if (integration.id === 'TWITTER_FOLLOW') {
            prev[integration.id] = {
              "reward": integration.reward,
              "screen_name": integration.value
            }
          }
          else if (integration.id.match(/CHOOSE_OPTION/)) {
            prev[integration.id] = {
              "reward": integration.reward,
              "question": integration.value,
              "options": integration.options.split(',')
            }
          }
          else {
            prev[integration.id] = {
              "reward": integration.reward,
              "question": integration.value,
            }
          }
          return prev;
        }, {})
    }

    const storageType = [
          {
            "prim": "pair",
            "args": [
              {
                "prim": "pair",
                "args": [
                  {
                    "prim": "string",
                    "annots": [
                      "%campaign_id"
                    ]
                  },
                  {
                    "prim": "timestamp",
                    "annots": [
                      "%deadline"
                    ]
                  }
                ]
              },
              {
                "prim": "map",
                "args": [
                  {
                    "prim": "string"
                  },
                  {
                    "prim": "nat"
                  }
                ],
                "annots": [
                  "%integrations"
                ]
              },
              {
                "prim": "string",
                "annots": [
                  "%metadata_url"
                ]
              }
            ]
          },
          {
            "prim": "string",
            "annots": [
              "%name"
            ]
          }
          ];

    const ipfsRes = await jsonToIPFS({
        address,
        data: metadata
      })

    console.log(ipfsRes)


    const storageSchema = new Schema(storageType);

    const data  = {
      name: name,
      deadline: deadline.toString() + ':00Z',
      campaign_id: campaignId,
      metadata_url: ipfsRes.ipfs,
      integrations: activeIntegrations.reduce((prev, current) =>  {
        return {...prev, [current.id]: current.reward};
      }, {})
    }

    // console.log(JSON.stringify(michelsonData, null, 2));
    const michelsonData = storageSchema.Encode(data);
    setDisabled(true)
    const res = await addCampaign(michelsonData);
    if (res) {
      alert('Contract Submitted, wait until it being mined!')
      setCampaign(campaignId);
      setTx(res['transactionHash'])

      const campaignResp = await saveCampaign({
        address,
        campaignId
      })
      console.log(campaignResp)
    }
    setDisabled(false);
    console.log(metadata);
  }

  return(
    <div>
      <Navbar address={address} onLogin={onLogin} onLogout={onLogout}/>
      <div className="container">
        { tx ?
            <div className="d-flex mt-5 row justify-content-center">
              <h4 className="mt-2">Your new campaign is being mined, be patient please!</h4>
              <h3 className="mt-2"><Link to={`/campaign/${campaign}`}>{`${config.DOMAIN}/campaign/${campaign}`}</Link></h3>
              <h5 className="mt-2"><a target='_blank' href={`${config.EXPLORER_URL}/${tx}`}>{`${config.EXPLORER_URL}/${tx}`}</a></h5>
            </div>
            :
          <div>
            <form className="d-flex row">
              <div className="formName  align-items-baseline">
                <label className="justify-content-start">Campaign Name</label>
                <div className="d-inline-flex">
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control"
                         id="name" placeholder="Awesome Campaign Name"/>
                </div>
                <button onClick={
                  (e) => {
                    e.preventDefault();
                    onSave()
                  }
                } className="btn btn-outline-primary justify-content-end"
                        disabled={disabled || activeIntegrations.length === 0}>Save
                </button>
              </div>

              <div className="formDeadline  align-items-baseline">
                <label htmlFor="start">Deadline</label>
                <input value={deadline} onChange={e => setDeadline(e.target.value)} type="datetime-local" id="start"
                       name="trip-start"/>
              </div>

              {activeIntegrations.map((integration, index) => {
                return (<div className="container disc">
                  <h5 className="mt-3 d-inline-flex">{integration.name}</h5>
                  <div className="btn btn-outline-danger btn-sm" onClick={(e) => {

                    removeIntegration(integration.id)
                  }}>Remove
                  </div>
                  <div className="d-flex">

                    <div className="formText  align-items-baseline ">
                      <label className="justify-content-start">
                        {
                          integration.id === 'DISCORD_JOIN_CHANNEL' ? "Invitation Link" :
                              integration.id === 'TWITTER_FOLLOW' ? 'Twitter user (@username)' :
                                  "Question Title"
                        }
                      </label>
                      <div className="d-inline-flex">
                        <input onChange={(e) => setValue(index, e.target.value)}
                               value={integration.value}
                               type="text"
                               className="form-control"
                               id="text"
                               placeholder=""/>
                      </div>
                    </div>

                    <div className="formRewards  align-items-baseline ">
                      <label className="justify-content-start">Rewards</label>
                      <div className="d-inline-flex">
                        <input type="number"
                               onChange={(e) => setReward(index, e.target.value)}
                               value={integration.reward}
                               className="form-control"
                               id="rewards"
                               placeholder=""/>
                      </div>
                    </div>

                    {
                      integration.id.match(/CHOOSE_OPTION/) ?
                          <div className="formKeys  align-items-baseline">
                            <label className="justify-content-start">Options (separate them using ',')</label>
                            <div className="d-inline-flex">
                            <textarea type="text"
                                      onChange={(e) => setOptions(index, e.target.value)}
                                      value={integration.options}
                                      className="form-control"
                                      id="keys"
                                      placeholder=""/>
                            </div>
                          </div> : <></>
                    }
                  </div>
                </div>);
              })}
            </form>
            <div className="d-flex mb-5">
              <div className="formDiscord d-inline-flex  align-items-baseline">
                <label htmlFor="discordSelect">Integration</label>
                <select id="discordSelect"
                        className="form-select"
                        value={selectedIntegration}
                        onChange={(e) => setSelectedIntegration(e.target.value)}>
                  {
                    integrations.map((integration, index) => {
                      return <option selected value={integration.id}>{integration.name}</option>
                    })
                  }
                </select>
              </div>
              <button onClick={addIntegration} className=" btn btn-link ">Add Integration</button>
            </div>
          </div>
        }
        <p className="mt-5 mb-5 "> Galaxy Campaigns</p>

      </div>
    </div>
  )
}

export default NewCampaignPage;
