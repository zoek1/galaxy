import React, {useState} from 'react'
import config from "../config";

function IntegrationButton ({id, name, imageIcon, rewarded, onClick, reward, claim, onRedeem, onCheck, deactivated}){
  const action = () => !rewarded && onClick();
  const [isOnHover, setOnHover] = useState(false);
  const onMouseover = (e) => {
   setOnHover(true);
  }
    //clear the text
  const onMouseout = (e) => {
   setOnHover(false);
  }
  return(
      <div>
      <button id={id} style={{paddingRight: '1px !important'}} className={` contentButton btn  ${rewarded ? 'btn-outline-dark' : claim ? 'btn-outline-success' :  'btn-outline-primary' } `}
              onClick={claim ? onRedeem : action}
              disabled={rewarded || deactivated}>
        <div className="d-flex align-items-baseline justify-content-between ">
          <div className="btn-content d-flex align-items-baseline text-left">
            <i className={imageIcon}></i>
            {name}
          </div>
          <div onMouseEnter={onMouseover} onMouseLeave={onMouseout} className="btn-content d-flex align-items-baseline justify-content-between">

              {
                  deactivated ? <div className="spinner-grow text-success" role="status"></div> :
                  rewarded    ? <div className="sync btn btn-dark">{reward.toString()} {config.CONTRACT_SYMBOL}</div> :
                  claim       ? <div className="sync btn btn-success">Claim {reward.toString()} {config.CONTRACT_SYMBOL}</div> :
                                <button onClick={onCheck} className="sync btn btn-primary">
                                    {isOnHover ? `Check`  : `+ ${reward} ${config.CONTRACT_SYMBOL}`}
                                </button>
              }
          </div>
        </div>
      </button>

      </div>
  )
}

export default IntegrationButton;
