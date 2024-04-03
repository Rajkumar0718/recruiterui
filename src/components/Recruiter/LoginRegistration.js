import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/LOGO.svg'
import { TextField } from "@mui/material";
import axios from 'axios';
import { toast } from 'react-toastify'
import { errorHandler } from '../../api/Api';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
const TextFieldWithStyle = styled(TextField)`
 & .MuiOutlinedInput-root {
height:3rem
 }
`;
const LoginRegistration = () => {
  const { token, recruiterId } = useParams();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState({ email: '', newPassword: '', panelistId: '' });
  const navigation = useNavigate();
  useEffect(() => {
    axios.get(`/api1/recruiter/getPassword/${recruiterId}`, { headers: { Authorization: "Bearer ".concat(`${token}`) } })
      .then(res => {
        if (res.data.response == null) {
          toast.warning("Link already used")
          navigation('/panelist');
        }
        else {
          setUser(res.data.response)
        }
      })
  }, [token, recruiterId, navigation])
  const handleSubmit = (event) => {
    event.preventDefault();
    user.panelistId = recruiterId;
    axios.post(`/api1/recruiter/set/password`, user, { headers: { Authorization: "Bearer ".concat(`${token}`) } })
      .then(res => {
        toast.success("Password Reset Successfully!")
        navigation('/panelist');
      })
      .catch(error => {
        errorHandler(error);
      })
  }
  const handleChange = (e, key) => {
    setUser(prevUser => ({
      ...prevUser,
      [key]: e.target.value
    }));
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }
  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light  border-bottom' style={{ backgroundColor: "#3b489e", height: "4rem", paddingTop: '0px' }}>
        <img src={logo} width={130}></img>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          </ul>
        </div>
      </nav>
      <div class="row signUp-form">
        <div class="border" style={{ position: "relative", left: "2rem", width: "40rem" }}>
          <div class="panel panel-default">
            <div class="panel-heading" style={{width:"40rem",position:"relative",right:"12px"}}>
              <h4 class="panel-title" style={{ textAlign: 'center', paddingBottom: '10px', paddingTop: '10px' }}>Set Password</h4>
            </div>
            <div class="panel-body">
              <form onSubmit={handleSubmit}>
                <div class="row" style={{ paddingLeft: '17px' }}>
                  <div class="form-group" >
                    <TextFieldWithStyle
                      className="col-12"
                      id="outlined-error-helper-text"
                      type="email"
                      label="E-Mail"
                      size="small"
                      value={user.email}
                      variant="outlined"
                      style={{ width: "155.5mm", position: "relative", right: "1rem" }}
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group" style={{ width: '243.5px' }}>
                    <TextFieldWithStyle
                      className="col-11 ml-3 mt-3"
                      id="outlined-basic"
                      name="password"
                      type="password"
                      label="New-Password"
                      value={user.newPassword}
                      autoComplete="new-password"
                      size="small"
                      variant="outlined"
                      onChange={(e) => handleChange(e, 'newPassword')}
                      style={{ width: '280px' }}
                    />
                  </div>
                  <div class="form-group" style={{ width: '243.5px' }}>
                    <TextFieldWithStyle
                      className="col-11 ml-2 mt-3"
                      id="outlined-basic"
                      name="password"
                      type="password"
                      label="Confirm-password"
                      value={confirmPassword}
                      autoComplete="new-password"
                      size="small"
                      variant="outlined"
                      onChange={(e) => handleConfirmPasswordChange(e, 'confirmPassword')}
                      style={{ width: '280px', position: "relative", left: '4rem' }}
                    />
                  </div>
                </div>
                <input type="submit" value="Reset Password" class="btn btn-info btn-block" style={{ marginBottom: '30px' ,position:"relative",top:"1rem",width:"37rem",height:"3rem"}} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginRegistration
