import React from 'react'

function IntegrationButton ({id, name, imageIcon, rewarded, onClick, reward}){
  const action = () => !rewarded && onClick();

  return(

      <div className={`contentButton btn  ${rewarded ? 'btn-outline-secondary' : 'btn-outline-primary' } `}
              onClick={action}
              disabled={rewarded}>
        <div className="d-flex align-items-baseline ">
          <i className={imageIcon}></i>
          <div className="btn-content d-flex align-items-baseline justify-content-between">
            {name}
              {
                  rewarded ? <i className="bi bi-check-square justify-content-end"></i> :
                    <div className="btn btn-success">+ {reward.toString()}</div>
              }

          </div>
        </div>
      </div>

  )
}

export default IntegrationButton;
