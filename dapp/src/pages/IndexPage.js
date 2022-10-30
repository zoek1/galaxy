import React from 'react';
import { Link } from "react-router-dom";

const IndexPage = (props) => {
    const {address, onLogin, onLogout} = props;

    return (
        <div className="IndexPage container d-flex flex-column align-items-center justify-content-center h-100">
          <div className="title">
            <h1>Loyalty DApp</h1>
          </div>
          <div className="content-button">
            <Link to={'/new'}><button className="btn1 btn btn-primary ">New Campaign</button></Link>
            <Link to={'/campaign'}><button className="btn2 btn btn-primary">View Campaign</button></Link>
          </div>
        </div>
    );
}

export default IndexPage;
