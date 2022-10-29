import React from 'react'
import Navbar from '../components/Navbar'

function NewCampaignPage (){
  return(
    <div>
      <Navbar/>
      <div className="container">
        <form className="d-flex row">

          <div className="formName  align-items-baseline">
            <label className="justify-content-start">Campaign Name</label>
            <div className="d-inline-flex">
              <input type="text" className="form-control" id="name" placeholder="Alex Santorini"/>
            </div>
          </div>

          <div className="formDeadline  align-items-baseline">
            <label for="start">Deadline</label>
            <input type="datetime-local" id="start" name="trip-start"/>
          </div>


          <div className="container disc">

            <div className="d-flex ">
              <div class="formDiscord d-inline-flex  align-items-baseline">
                <label for="discordSelect">Integration</label>
                <select id="discordSelect" class="form-select">
                  <option selected>Choose...</option>
                  <option>Twitch login</option>
                  <option>Twitch channel</option>
                  <option>Twitch join</option>
                  <option>Telegram join</option>
                  <option>Twitter account</option>
                  <option>Twitter tuit</option>
                  <option>Discord login</option>
                  <option>Discord join</option>
                  <option>Email field</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div className="formText  align-items-baseline ">
                <label className="justify-content-start">Text</label>
                <div className="d-inline-flex">
                  <input type="text" className="form-control" id="text" placeholder=""/>
                </div>
              </div>

              <div className="formRewards  align-items-baseline ">
                <label className="justify-content-start">Rewards</label>
                <div className="d-inline-flex">
                  <input type="text" className="form-control" id="rewards" placeholder=""/>
                </div>
              </div>

              <div className="formKeys  align-items-baseline">
                <label className="justify-content-start">Keys</label>
                <div className="d-inline-flex">
                  <input type="text" className="form-control" id="keys" placeholder=""/>
                </div>
              </div>
            </div>
          </div>

        </form>

        <button className=" btn btn-link ">Add Integration</button>
      </div>
    </div>
  )
}

export default NewCampaignPage;
