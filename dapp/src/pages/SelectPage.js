import React from 'react'
import Navbar from '../components/Navbar'

function SelectPage () {
  return(
    <div>
      <Navbar/>
      <div className="container">
        <div className="selectPage d-flex flex-column align-items-center justify-content-center h-100">
          <div className="title">
            <h5>Select option</h5>
          </div>
          <select class="form-select" aria-label="Default select example">
            <option selected>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>

        </div>
        <div className="buttonSend d-flex justify-content-end">
          <button className="btn btn-primary " >Send</button>
        </div>
      </div>
    </div>
  )
}

export default SelectPage;
