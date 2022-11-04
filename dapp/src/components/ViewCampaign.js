import React, {useContext} from 'react'
import Context from "../context";
import config from "../config";

function ViewCampaign(props){
  const {titleCard, rewards, duration, integrations } = useContext(Context);

  return(
    <div className="card cardView">
      <div className="card-header">
        Title card
      </div>
      <div className="card-body">
        <h5 className="card-title">Rewards</h5>
        <p class="card-text">With supporting</p>
        <h5 className="card-title">Duration</h5>
        <p class="card-text">With supporting</p>
        <h5 className="card-title">Integrations</h5>
        <ul className="icon d-inline-flex">
          <li><i class="bi bi-twitter"></i></li>
          <li><i class="bi bi-discord"></i></li>
          <li><i class="bi bi-question-circle-fill"></i></li>
        </ul>
      </div>
    </div>
  )
}

export default ViewCampaign;
