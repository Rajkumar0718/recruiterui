import React from 'react'
import { getCurrentUser } from '../../api/Api';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/LOGO.svg'

const Header = (props) => {
  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-light  border-bottom' style={{ backgroundColor: "#3b489e", height: "4rem" }}>
        <img src={logo} width={110}></img>
        <div class="collapse navbar-collapse" id="navbarSupportedContent" style={{ marginLeft: '550px' }}>
          <ul class="navbar-nav">
            <li class="nav-item active">
              <Link to='/panelist/dashboard' className="nav-link" style={{ marginLeft: '80px' }}>
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li class="nav-item active">
              <Link to='/panelist/timeSlot' className="nav-link" >
                Time slot <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Organisation
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="https://ssbsoft.com/" target="_blank">About us</a>
                <a class="dropdown-item" href="#">Features</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Layout</a>
              </div>
            </li>
            <li class="nav-item active">
              <Link to='/panelist/contactAdmin' className="nav-link" >
                Contact Admin <span className="sr-only">(current)</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                {getCurrentUser().userName.toUpperCase()}
              </a>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href='/panelist/profile'>
                  <i className="fa fa-user mr-2 text-gray-400"></i>
                  Profile
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" onClick={() => props.logOut()} >
                  <i className="fa fa-sign-out mr-1 text-gray-400"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Header
