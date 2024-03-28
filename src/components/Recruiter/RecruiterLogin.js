import React from 'react'
import logo from '../../assets/images/LOGO.svg'
const RecruiterLogin = () => {
  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-light bg-light border-bottom'>
        <img src={logo} width={130} />
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            {/* <Link to="/panelist/enroll" className='btn btn-secondary' >Panelist Enrollment</Link> */}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default RecruiterLogin
