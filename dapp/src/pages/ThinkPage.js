import React from 'react'
import Navbar from '../components/Navbar'

function ThinkPage () {
  return(
    <div>
      <Navbar/>
      <div className="container">
        <div className="thinkPage d-flex flex-column align-items-center justify-content-center h-100">
          <div className="title">
            <h5>What do you think?</h5>
          </div>
          <div className="textareaContent form-floating">
            <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
            <label for="floatingTextarea">Comments</label>
          </div>
        </div>
        <div className="buttonSend d-flex justify-content-end">
          <button className="btn btn-primary " >Send</button>
        </div>
      </div>
    </div>
  )
}

export default ThinkPage;
