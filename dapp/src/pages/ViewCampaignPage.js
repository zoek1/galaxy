import React from 'react'
import Navbar from '../components/Navbar'
import IntegrationButton from '../components/IntegrationButton'

const Fields = [
  {
    id: 1,
    name: 'Discord',
    image: 'bi bi-discord'
  },
  {
    id: 2,
    name: 'Join Telegram',
    image: 'bi bi-telegram'
  },
  {
    id: 3,
    name: 'Suscribe Newsletter',
    image: 'bi bi-newspaper'
  },
  {
    id: 4,
    name: 'What do you thing?',
    image: 'bi bi-question'
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
              <IntegrationButton name={field.name} imageIcon={field.image}/>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ViewCampaignPage;
