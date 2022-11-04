import React from 'react'

function CardReward(){
  return(
  <div className="card cardReward">
    <img src="https://static5.depositphotos.com/1013513/502/i/450/depositphotos_5021225-stock-photo-beautiful-morning-at-spring-before.jpg" className="card-img-top"/>
    <div className="card-body">
      <h5 className="card-title">Reward</h5>
      <p className="card-text">With supporting</p>
      <div className="d-flex d-inline-flex">
        <div className="d-flex row justify-content-start">
          <h5 className="card-title">Existence</h5>
          <p className="card-text">With supporting</p>
        </div>
        <div className="d-flex row justify-content-end">
          <h5 className="card-title">Cost</h5>
          <p className="card-text">100000</p>
        </div>
      </div>
      <button className="btn btn-primary">Buy</button>
    </div>
  </div>
  )
}

export default CardReward;
