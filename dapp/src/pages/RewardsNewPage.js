import React, {useContext, useEffect, useState} from 'react'
import Context from "../context";
import Navbar from '../components/Navbar'
import config from "../config";
import {Link} from "react-router-dom";
import {addCampaign, addReward, getCampaigns} from "../utils/contract";
import {fileToIPFS, getCampaignsFromCache, jsonToIPFS, saveCampaign, saveReward} from "../utils/request";
import {v4 as uuidv4} from "uuid";
import {Schema} from "@taquito/michelson-encoder";

function RewardsNewPage(props) {
  const {address, onLogin, onLogout, balance, contract} = useContext(Context);
  const [name, setName] = useState("");
  const [existence, setExistence] = useState(1);
  const [cost, setCost] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState([]);
  const [rewardId, setRewardId] = useState(null);

  const [image, setImage] = useState(null)

  const [disabled, setDisabled] = useState(false);
  const [tx, setTx] = useState('');

  const handleFile = (file) => {
    console.log(file.size)
    if (file.size > 1048576) {
      alert("File size cannot exceed more than 1MB");
      return;
    }
      setImage(file)
  };

  const retrieveCampaigns = async (campaignIds) => {
      const campaigns = await getCampaigns(contract.current, campaignIds);
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


  const onSave = async () => {
    const rewardId = uuidv4();

    if (name.trim() === '')  { alert('Error: Name is empty'); return;}
    if (existence <= 0)  { alert('Error: Existence should be greater than 0'); return;}
    if (cost < 0)  { alert('Error: Cost should be greater than 0'); return;}

    if (!address) {
        alert("Requires Login");
        return;
    }

    const uploadRes = await fileToIPFS({
        address,
        file: image
    })

    const metadata = {
        name,
        existence,
        cost,
        owner: address,
        campaign: campaignId,
        thumbnail: uploadRes.ipfs
    }


    const ipfsRes = await jsonToIPFS({
        address,
        data: metadata
      })


    console.log(ipfsRes)

    const storageType = [
        {
            "prim": "pair",
            "args": [
                {
                    "prim": "string"
                },
                {
                    "prim": "nat"
                }
            ]
            },
            {
                "prim": "nat"
            }
    ];
    const storageSchema = new Schema(storageType);
    console.log(storageSchema)
    const data  = [rewardId, cost, existence]

    // console.log(JSON.stringify(michelsonData, null, 2));
    const michelsonData = storageSchema.Encode(data);
    setDisabled(true)
    const res = await addReward(michelsonData);
    if (res) {
      alert('Contract Submitted, wait until it being mined!')
      setRewardId(campaignId);
      setTx(res['transactionHash'])

      const rewardResp = await saveReward({
        address,
        rewardId,
        ipfs: uploadRes.ipfs
      })
      console.log(rewardResp)
    }
    setDisabled(false);
    console.log(metadata);
  }


  return(
    <div>
      <Navbar address={address} onLogin={onLogin} onLogout={onLogout}/>
      <div className="container">
        {tx ?
            <div className="d-flex mt-5 row justify-content-center">
              <h4 className="mt-2">Your new campaign is being mined, be patient please!</h4>
              <h3 className="mt-2"><Link to={`/rewards#${rewardId}`}>{`${config.DOMAIN}/rewards#${rewardId}`}</Link>
              </h3>
              <h5 className="mt-2"><a target='_blank'
                                      href={`${config.EXPLORER_URL}/${tx}`}>{`${config.EXPLORER_URL}/${tx}`}</a></h5>
            </div>
            : <>
            <form className="d-flex row">
              <div className="align-items-baseline">
                <label className="justify-content-start col-sm-2">Reward Name</label>
                <div className="d-inline-flex">
                  <input type="text" className="form-control  col-sm-4" id="name"
                         value={name}
                         onChange={e => setName(e.target.value)}
                         placeholder="Reward Name"/>
                </div>
              </div>
              <div className="align-items-baseline">
                <label className="justify-content-start col-sm-2">Existence</label>
                <div className="d-inline-flex">
                  <input type="number" className="form-control" id="existence"
                         value={existence}
                         onChange={e => setExistence(e.target.value)}
                         placeholder="123"/>
                </div>
              </div>
              <div className="align-items-baseline">
                <label className="justify-content-start col-sm-2">Cost</label>
                <div className="d-inline-flex input-group mb-3">
                  <span className="input-group-text">$</span>
                  <input type="number" className="form-control"
                         onChange={e => setCost(e.target.value)}
                         value={cost} id="cost"
                         aria-label="Dollar amount (with dot and two decimal places)"/>
                </div>
              </div>
              <div className="align-items-baseline">
                <label className="justify-content-start col-sm-2">Campaign (optional)</label>
                <div className="d-inline-flex">
                  <select className="form-select" type="text" id="campaign"
                          value={campaignId} onChange={e => setCampaignId(e.target.value)}
                          aria-label="Campaign">
                    <option selected disabled>Open this select menu</option>
                    {
                      campaigns.filter(campaign => campaign[1]).map((campaign, index) => {
                        console.log(campaign)
                        return <option selected value={campaign[0]}>{campaign[1].name}</option>
                      })
                    }
                  </select>
                </div>
              </div>
              <div className="align-items-baseline">
                <label htmlFor="formFile" className="form-label col-sm-2">Upload image</label>
                <input className="form-control col-sm-4"
                       onChange={(e) => handleFile(e.target.files[0])}
                       type="file" id="formFile"/>
              </div>
            </form>
              <button className="btnPublish btn btn-primary" disabled={disabled} onClick={onSave}>Publish</button>
            </>
        }
      </div>
    </div>

  )
}

export default RewardsNewPage;
