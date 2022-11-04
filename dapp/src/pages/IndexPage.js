import React from 'react';
import { Link } from "react-router-dom";

const IndexPage = (props) => {
    const {address, onLogin, onLogout} = props;

    return (
      <div className="IndexPage container d-flex flex-column align-items-center justify-content-center h-100">
        <div className="logo">
          <img src="/galaxy512.png"></img>
        </div>
        <div className="content-button">
          <Link to={'/campaign/new'}><button className="btn1 btn btn-primary">New Campaign</button></Link>
          <Link to={'/campaigns'}><button className="btn2 btn btn-primary">View Campaigns</button></Link>
        </div>
      </div>
    );
}

export default IndexPage;
