import React from 'react'

function Navbar(){
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
             <a className="nav-link bi bi-person-fill" href="#"></a>
           </li>
         </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
