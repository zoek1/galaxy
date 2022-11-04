import React from 'react'
import BigNumber from "bignumber.js";
import config from "../config";
import hdate from "human-date";
import {useNavigate} from "react-router-dom";

function ViewCampaign(props){
    const {
        id,
        name,
        integrations,
        deadline
    } = props;
    const navigate = useNavigate()

    const vals =[...integrations.values()]
    const keys = [...integrations.keys()]
    console.log(vals)
    const rewards = BigNumber.sum.apply(null, vals)

  return(<a onClick={() => { navigate(`/campaign/${id}`) }}>
    <div className="card cardView">
      <div className="card-header">
          {name}
      </div>
      <div className="card-body">
        <h5 className="card-title">Rewards</h5>
        <p class="card-text">{rewards.toString()} {config.TOKEN}</p>
        <h5 className="card-title">Duration</h5>
        <p class="card-text">{hdate.relativeTime(deadline)}</p>
        <h5 className="card-title">Integrations</h5>
        <ul className="p-0 icon d-inline-flex">
            {
                keys.map(integration => {
                    if (integration === 'DISCORD_JOIN_CHANNEL') return <li><i className="bi bi-discord"></i></li>
                    if (integration === 'DISCORD_JOIN_CHANNEL') return <li><i className="bi bi-twitter"></i></li>
                    if (integration.match(/CHOOSE_OPTION/)) return <li><i className="bi bi-c-square-fill"></i></li>
                    return <li><i className="bi bi-question-circle-fill"></i></li>
                })
            }

        </ul>
      </div>
    </div>
  </a>
  )
}

export default ViewCampaign;
