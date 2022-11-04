import React, {useContext} from 'react'
import Context from "../context";
import Navbar from '../components/Navbar'
import config from "../config";
import {Link} from "react-router-dom";

function RewardsNewPage(props){
  const {address, onLogin, onLogout, balance } = useContext(Context);

  return(
    <div>
      <Navbar address={address} onLogin={onLogin} onLogout={onLogout}/>
      <div className="container">
        <form className="d-flex row">
          <div className="align-items-baseline">
            <label className="justify-content-start col-sm-2">Reward Name</label>
            <div className="d-inline-flex">
              <input type="text" className="form-control  col-sm-4" id="name" placeholder="Reward Name"/>
            </div>
          </div>
          <div className="align-items-baseline">
            <label className="justify-content-start col-sm-2">Existence</label>
            <div className="d-inline-flex">
              <input type="text" className="form-control" id="name" placeholder="123"/>
            </div>
          </div>
          <div className="align-items-baseline">
            <label className="justify-content-start col-sm-2">Cost</label>
            <div className="d-inline-flex input-group mb-3">
              <span className="input-group-text">$</span>
              <input type="text" class="form-control" aria-label="Dollar amount (with dot and two decimal places)"/>
            </div>
          </div>
          <div className="align-items-baseline">
            <label className="justify-content-start col-sm-2">Campaign (optional)</label>
            <div className="d-inline-flex">
              <input type="text" className="form-control" id="name" placeholder="Campaign"/>
            </div>
          </div>
          <div className="align-items-baseline">
            <label for="formFile" className="form-label col-sm-2">Upload image</label>
            <input className="form-control col-sm-4" type="file" id="formFile"/>
          </div>
        </form>
        <button className="btnPublish btn btn-primary">Publish</button>
      </div>
    </div>

  )
}

export default RewardsNewPage;
