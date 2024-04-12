import React,{useState} from 'react'
import logo from '../../assets/images/LOGO.svg'
import axios from 'axios'
import { toastMessage } from '../../utils/ResponseMessage'
import { Link, useNavigate } from 'react-router-dom';
import { TextField } from "@mui/material";
const RecruiterLogin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const handleChange = (event) => {
    setUser({
        ...user,
        [event.target.name]: event.target.value
    });
}

  const handleSubmit = event => {
    event.preventDefault();

    axios.post(`/api1/recruiter/login`, user)
      .then(res => {
        sessionStorage.setItem('user', JSON.stringify(res.data.response));
        sessionStorage.setItem('token', res.data.response.jwtToken);
        localStorage.setItem('token', res.data.response.jwtToken);
        sessionStorage.setItem('role', "recruiter");
        if (sessionStorage.getItem('token')) {
          toastMessage('success', 'Login successfully!');
          navigate('/panelist/dashboard');
        }
      }).catch(error => {
        toastMessage('error', 'Invalid username or password!');
      })
  }
  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-light  border-bottom' style={{backgroundColor:"#3b489e", height:"4rem"}}>
        <img src={logo} width={130} />
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            {/* <Link to="/panelist/enroll" className='btn btn-secondary' >Panelist Enrollment</Link> */}
          </ul>
        </div>
      </nav>
      <div className="row">
        <div className="col" style={{ marginLeft: '315px', marginRight: '270px', marginTop: '50px' }}>
          <div className="content-center">
            <div className="" style={{ borderRadius: '0.5rem' }}>
              <div className="">
                <div className="">
                  <h3 style={{ color: 'GrayText', textAlign: 'center' }}> Panelist Login</h3>
                  <form className="form-signin" style={{ textAlign: 'center' }} onSubmit={handleSubmit}>
                    <TextField className="m-2 col-10" name='email' onChange={handleChange} id="outlined-basic" label="Email" variant="outlined" />
                    <TextField className="m-2 col-10" type='password' name='password' onChange={handleChange} id="outlined-basic" label="Password" variant="outlined" />
                    <button type="submit" className="btn btn-secondary col-10" style={{backgroundColor:"#3b489e"}}>Login</button>
                  </form>
                  <div style={{ textAlign: 'center' }} >
                    <div style={{ marginTop: '5px' }}>
                      <Link to="/panelist/enroll" style={{ textDecoration: 'none', color: '#0abfb6' }}>Enrollment</Link>
                    </div>
                    <div style={{ paddingBottom: '20px' }}>
                      <Link to="/admin/forgot/password" style={{ textDecoration: 'none', color: '#8c8c8c' }}>Forgot password?</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RecruiterLogin
