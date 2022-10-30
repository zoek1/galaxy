import React from 'react'
import Navbar from '../components/Navbar'
import IntegrationButton from '../components/IntegrationButton'
import { Link } from "react-router-dom";

const Fields = [
  {
    id: 1,
    name: 'Discord',
    image: 'bi bi-discord',
    integration_action: 'link_account',
  },
  {
    id: 2,
    name: 'Join Telegram',
    image: 'bi bi-telegram',
    integration_action: 'link_account',
  },
  {
    id: 3,
    name: 'Suscribe Newsletter',
    image: 'bi bi-newspaper',
    integration_action: 'link_account',
  },
  {
    id: 4,
    name: 'What do you thing?',
    image: 'bi bi-question',
    integration_action: 'ask_question',
  }
]

function ViewCampaignPage (){
  return(
    <div>
      <Navbar/>
      <div className="view container d-flex flex-column align-items-center justify-content-center h-100">
        {
          Fields.map(field =>(
            <div key={field.id}>
            { field.integration_action === 'ask_question' ?
              <Link to={'/think'}>
                <IntegrationButton id={field.id} name={field.name} imageIcon={field.image}/>
              </Link>
              : <IntegrationButton id={field.id} name={field.name} imageIcon={field.image}/>
            } 

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ViewCampaignPage;
