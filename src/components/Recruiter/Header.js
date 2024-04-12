import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '../../api/Api';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/LOGO.svg'
import axios from 'axios'
import { authHeader, errorHandler, logOut } from '../../api/Api';
import download from "../../assets/images/download.png";
const Header = (props) => {
  const [recruiter, setRecruiter] = useState({
    id: '',
    userName: '',
    authId: '',
    email: '',
    password: '',
    phone: '',
    verifiedStatus: '',
    industryType: '',
    dob: '',
    gender: '',
    qualification: '',
    experience: '',
    location: '',
    picture: '',
    skillSet: [],
  });

  useEffect(() => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    let recruiterId = user.id;
    axios.get(`/api1/recruiter/get?recruiterId=${recruiterId}`, { headers: authHeader() })
      .then(res => {
        setRecruiter(res.data.response)
      })
  }, [recruiter.picture])

  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-light  border-bottom' style={{ backgroundColor: "#3b489e", height: "3.5rem" }}>
        <img src={logo} width={110} style={{ marginLeft: ".5rem" }} />
        <div class="collapse navbar-collapse" id="navbarSupportedContent" style={{ marginLeft: '403px' }}>
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
            <li class="nav-item active">
              <Link to='/panelist/contactAdmin' className="nav-link" >
                Contact Admin <span className="sr-only">(current)</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ display: "flex", justifyContent: "center",width:"23rem" }}>
          <div className="user-info">
        <div class="vl"></div>
            <div>
              <p style={{display:"flex",justifyContent:"center",marginBottom:"0rem",color:"white"}}>
                <b>{getCurrentUser().userName.toUpperCase()}</b>
              </p>
              <div className="actions">
              <Link to={"/panelist/profile"}>
              <button style={{border:"none",backgroundColor: " rgb(59, 72, 158)",color:"white"}}>Edit Profile</button>
            </Link>
                <span className="separator">|</span>
                <button style={{border:"none",backgroundColor: " rgb(59, 72, 158)", color:"white"}}onClick={() => props.logOut()}>
              Log out
            </button>
              </div>
            </div>
          </div>

        </div>
        <div>
          <img src={recruiter?.picture || download} alt='Profile' className='profile-pic' />
        </div>
      </nav>
    </>
  )
}

export default Header
// {/* className="user-name" */}
// <p >{getCurrentUser().userName.toUpperCase()}</p>
// {/* className="edit-profile-button" */}
// <div>
//   <Link to={"/panelist/profile"}>
//     <button>Edit Profile</button>
//   </Link>
//   {/* className="separator" */}
//   <span >|</span>
//   {/* className="logout-button" */}
//   <button onClick={() => props.logOut()}>
//     Log out
//   </button>
// </div>
