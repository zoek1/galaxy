import React, {useContext} from 'react'
import Context from "../context";

function Navbar(props){
  const {address, onLogin, onLogout } = useContext(Context);

  return(
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src="#" width="30" height="30" alt=""/>
        </a>
        <div className="d-flex justify-content-end align-items-baseline" id="navbarTogglerDemo01">
         <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
           <li className="nav-item">
             <a className="nav-link" href="#">Campaign</a>
           </li>
           <li className="nav-item">
             <a className="nav-link" href="#">Rewards</a>
           </li>
           <li className="nav-item">
             {
               !address ? <a className='nav-link ' href="#" onClick={onLogin}>Log In</a> :
                  <div>
                    <a className="nav-link bi bi-person-fill" href="#"></a>
                    <div>
                      <p>{address}</p>
                      <a className='nav-link' onClick={onLogout}>Log Out</a>
                    </div>
                  </div>
             }

           </li>
         </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
