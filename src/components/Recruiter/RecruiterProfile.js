import React, { useEffect, useState } from 'react'
import axios from 'axios'
import _ from "lodash";
import { authHeader, errorHandler, logOut } from '../../api/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RecruiterProfile = () => {
  const navigation = useNavigate();
  const [options, setOptions] = useState([]);
  const [skillSet, SetSkillSet] = useState([]);
  const [validPictureButton, setValidpictureButton] = useState(true);
  const [resume, setResume] = useState(null);
  const [inputError, setInputError] = useState('');
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

  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  useEffect(() => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    let recruiterId = user.id;
    axios.get(`/api1/recruiter/get?recruiterId=${recruiterId}`, { headers: authHeader() })
      .then(res => {
        setRecruiter(res.data.response)
      })
  }, [])

  const handlePicture = event => {
    if (event.target.files[0].size <= 1048576) {
      setInputError("");
      setRecruiter(prevRecruiter => ({
        ...prevRecruiter,
        picture: event.target.files[0],
      }));
      setValidpictureButton(false);
    } else {
      let error = "please upload picture size less then 1MB"
      setInputError(error);
    }
  }
  const profilePicture = event => {
    const formData = new FormData();
    formData.append('picture', recruiter.picture);
    formData.append('recruiterId', recruiter.id);
    axios.post(`/api1/recruiter/picture`, formData, { headers: authHeader() })
      .then(res => {
        toast.success("picture Uploaded Successfully!")
        let user = JSON.parse(sessionStorage.getItem("user"));
        let recruiterId = user.id;
        axios.get(`/api1/recruiter/get?recruiterId=${recruiterId}`, { headers: authHeader() })
          .then(res => {
            setRecruiter(res.data.response)
          })
      })
      .catch(error => {
        errorHandler(error);
      })
  }
  const handleSubmit = event => {
    event.preventDefault();
    axios.post(`/api1/recruiter/update`, recruiter, { headers: authHeader() })
      .then(res => {
        toast.success("Updated Successfully!")
        let user = JSON.parse(sessionStorage.getItem("user"));
        let recruiterId = user.id;
        axios.get(`/api1/recruiter/get?recruiterId=${recruiterId}`, { headers: authHeader() })
          .then(res => {
            setRecruiter(res.data.response)
          })
          navigation("/panelist/dashboard")
      })
      .catch(error => {
        errorHandler(error);
      })
  }
  const handleChange = (e, key) => {
    setRecruiter(prevRecruiter => ({ ...prevRecruiter, [key]: e.target.value }));
  }
  return (
    <div class="container">
      <div class="main-body">
        <div class="row gutters-sm">
          <div class="col-md-4 mb-3">
            <div class="border-profile">
              <div class="card-body">
                <div class="d-flex flex-column align-items-center text-center">
                  <img src={recruiter.picture} alt="Recruiter" width="150" />
                  <div class="mt-3">
                    <h4>{(recruiter.userName).toUpperCase()}</h4>
                    <p class="text-secondary mb-1">{recruiter.email}</p>
                    <p class="text-muted font-size-sm">{recruiter.phone}</p>
                  </div>
                  <div class='row'>
                    <input type="file" accept="image/gif, image/jpeg, image/png" name="image" id="file" onChange={(event) => handlePicture(event)} ></input>
                    <button className="btn btn-primary" disabled={validPictureButton} style={{  marginTop: '15px',width:'5rem',position:"relative",left:"13rem" }} onClick={profilePicture}>Upload</button>
                    <span style={{ color: 'red', fontSize: '10px' }}>
                      {inputError}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="card-details">
              <div class="card-body">
                <form onSubmit={handleSubmit}>
                  <div class="row">
                    <div class="col-sm-3">
                      <h6 class="mb-0">Date of Birth</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      <span>{new Date(recruiter.dob).getDate() + '-' + months[new Date(recruiter.dob).getMonth()] + '-' + new Date(recruiter.dob).getFullYear()}</span>
                    </div>
                  </div>
                  <hr></hr>
                  <div class="row">
                    <div class="col-sm-3">
                      <h6 class="mb-0">Gender</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      <span>
                        {recruiter.gender}
                      </span>
                    </div>
                  </div>
                  <hr></hr>
                  <div class="row">
                    <div class="col-sm-3">
                      <h6 class="mb-0">Qualification</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      <input value={recruiter.qualification} placeholder='Enter your Qualification' style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }} onChange={(e) => handleChange(e, 'qualification')}></input>
                    </div>
                  </div>
                  <hr></hr>
                  <div class="row">
                    <div class="col-sm-3">
                      <h6 class="mb-0">Experience</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      <input type='number' value={recruiter.experience} style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }} placeholder='Enter your Experience' onChange={(e) => handleChange(e, 'experience')}></input>
                    </div>
                  </div>
                  <hr></hr>
                  <div class="row">
                    <div class="col-sm-3">
                      <h6 class="mb-0">Technologies</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      <div class='col-5' style={{ paddingLeft: '0px' }}>
                        {_.map(recruiter.skillSet, (skill) => { return <span>{skill.skillName.toUpperCase()}&nbsp;&nbsp;</span> })}
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                  <div class="row">
                    <div class="col-sm-3">
                      <h6 class="mb-0">industryType</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      <span>{recruiter.industryType.name}</span>
                    </div>
                  </div>
                  <hr></hr>
                  <div class="row">
                    <div class="col-sm-3">
                      <h6 class="mb-0">Location</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      <textarea name="location"
                        value={recruiter.location}
                        onChange={(e) => handleChange(e, 'location')}
                        id="location" placeholder="Enter the location" maxlength="1000" autocomplete="off" style={{ height: '30px', width: '250px', opacity: '0.5' }} ></textarea>
                    </div>
                  </div>
                  <hr></hr>
                  <div className="form-group row">
                    <div className="col-md-10">
                      <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default RecruiterProfile
