import React from 'react'
import Navbar from '../components/Navbar'

const Options = [
  {
    id: 1,
    option: "One",
  },
  {
    id: 2,
    option: "Two",
  },
  {
    id: 1,
    option: "Three",
  }
]

function SelectPage () {
  return(
    <div>
      <Navbar/>
      <div className="container">
        <div className="selectPage d-flex flex-column align-items-center justify-content-center h-100">
          <div className="title">
            <h5>Select option</h5>
          </div>
          {
            Options.map(op =>(
              <div class="form-check ">
                <input class="form-check-input" type="checkbox" value="" id={op.id}/>
                <label class="form-check-label" for="flexCheckDefault">
                  {op.option}
                </label>
              </div>
            ))
          }

        </div>
        <div className="buttonSend d-flex justify-content-end">
          <button className="btn btn-primary " >Send</button>
        </div>
      </div>
    </div>
  )
}

export default SelectPage;
