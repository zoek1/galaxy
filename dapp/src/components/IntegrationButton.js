import React from 'react'

function IntegrationButton ({id, name, imageIcon}){
  return(

      <button type="button" className="contentButton btn btn-outline-primary">
        <div className="d-flex align-items-baseline ">
          <i className={imageIcon}></i>
          <a className="d-flex align-items-baseline justify-content-between">
            {name}
            <i class="bi bi-check-square justify-content-end"></i>
          </a>
        </div>
      </button>

  )
}

export default IntegrationButton;
