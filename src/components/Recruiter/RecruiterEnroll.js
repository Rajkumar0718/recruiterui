import React, { useState,useEffect } from 'react'
import logo from '../../assets/images/LOGO.svg'
import { isEmpty, isValidEmail, isValidMobileNo } from '../../utils/Validation';
import axios from 'axios'
import { toast } from 'react-toastify';
import { TextField } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { authHeader} from '../../api/Api';
import Select from 'react-select';
import _ from "lodash";
import dayjs from 'dayjs';
const RecruiterEnroll = () => {
  const [skillOptions, setSkillOptions] = useState([]);
  const [industryOptions, setIndustryOptions  ] = useState([]);
  const [resume, setResume] = useState(null);
  const [dateInputError, setDateInputError] = useState();
  const [inputError, setInputError] = useState();
  const [recruiter, setRecruiter] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    verifiedStatus: 'NOTVERIFIED',
    industryType: {},
    dob: new Date(),
    gender: '',
    qualification: '',
    experience: '',
    location: '',
    skillSet: [],
  })
  const [error, setError] = useState({
    firstName: '',
    helperTxtFirstName: '',
    lastName: '',
    helperTxtLastName: '',
    email: '',
    helperTxtEmail: '',
    phone: '',
    helperTxtPhone: '',
    industryType: '',
    helperTxtIndustryType: '',
    dob: '',
    helperTxtdob: '',
    gender: '',
    helperTxtGender: '',
    qualification: '',
    helperTxtQualification: '',
    experience: '',
    helperTxtExperience: '',
    location: '',
    helperTxtLocation: '',
  })
  useEffect(() => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user !== null) {
      let recruiterId = user.id;
      setRecruiter(prevState => ({ ...prevState, id: recruiterId }));
      axios.get(`/api1/recruiter/get?recruiterId=${recruiterId}`, { headers: authHeader() })
        .then(res => {
          setRecruiter(res.data.response);
        })
    }

    axios.get(`/api1/industry`)
      .then(res => {
        var industryOptions = [];
        _.map(res.data.response, val => {
          let obj = {};
          obj.value = val;
          obj.label = val.name;
          industryOptions.push(obj);
          setIndustryOptions(industryOptions);
        });
      }).catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (e, key) => {
    setRecruiter(prevState => ({ ...prevState, [key]: e.target.value }));

  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const newRecruiter = { ...recruiter };
    const newError = { ...error };

    if (isEmpty(newRecruiter.firstName) || newRecruiter.firstName.trim() === "") {
      newError.firstName = true;
      newError.helperTxtFirstName = "First Name can't be empty";
    } else {
      newError.firstName = false;
    }

    if (isEmpty(newRecruiter.lastName) || newRecruiter.lastName.trim() === "") {
      newError.lastName = true;
      newError.helperTxtLastName = "Last Name can't be empty";
    } else {
      newError.lastName = false;
    }

    if (isEmpty(newRecruiter.email) || newRecruiter.email.trim() === "" || !isValidEmail(newRecruiter.email)) {
      newError.email = true;
      newError.helperTxtEmail = "please enter a valid Email";
    } else {
      newError.email = false;
    }

    if (isEmpty(newRecruiter.phone) || newRecruiter.phone.trim() === "" || !isValidMobileNo(newRecruiter.phone)) {
      newError.phone = true;
      newError.helperTxtPhone = "please enter a valid Phone Number";
    } else {
      newError.phone = false;
    }
    setError(newError);
    if (Object.values(newError).every(val => !val)) {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('recruiter', JSON.stringify(newRecruiter));

      axios.post(`/api1/recruiter/save`, formData)
        .then((res) => {
          sessionStorage.setItem('user', JSON.stringify(res.data.response));
          sessionStorage.setItem('token', res.data.response.jwtToken);
          sessionStorage.setItem('role', 'recruiter');
          if (sessionStorage.getItem('token')) {
            toast.success('your Details Added Successfully');
            setRecruiter(res.data.response);
            window.location.href = '/panelist/enroll-2';
          }
        }).catch(error => {
          toast.error(error.response.data.message);
        });
    }
  };
  const handleDateChange = (date) => {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var birthYear = date.year();
    var age = currentYear - birthYear;
    if (age >= 21) {
      setRecruiter(prevState => ({ ...prevState, dob: date }));
      setDateInputError("");
    } else {
      setDateInputError("your age should be greater than 21");
    }
  };
  const handleIndustry = (e, key) => {
    setRecruiter(prevState => ({ ...prevState, [key]: e.value }));
    getSkillSet(e.value);
  };

  const getSkillSet = (industryType) => {
    axios.get(`/api1/skillset/industry/` + industryType.id)
      .then(res => {
        if (res.data.response.length === 0) {
          setSkillOptions([]);
        } else {
          var skillOptions = [];
          _.map(res.data.response, val => {
            let obj = {};
            obj.value = val;
            obj.label = val.skillName;
            skillOptions.push(obj);
            setSkillOptions(skillOptions);
          });
        }
      });
  };
  const handleMultiSelect = (e) => {
    var newRecruiter = { ...recruiter };
    var newError = { ...error };
    var skillSet = [];
    _.map(e, val => {
      let skillsets;
      skillsets = val.value;
      let length = skillSet.push(skillsets);
    });
    newRecruiter.skillSet = skillSet;
    setRecruiter(newRecruiter);
    setError(newError);
  };
  const handleResume = event => {
    if (event.target.files[0].size <= 1048576) {
      if (event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || event.target.files[0].type === 'application/pdf') {
        setInputError("");
        setResume(event.target.files[0]);
      } else {
        setInputError("please upload correct format");
      }
    } else {
      setInputError("please upload resume size less than 1MB");
    }
  };
  const fields = [
    {
      label: "First Name",
      error: error.firstName,
      helperText: error.firstName ? error.helperTxtFirstName : null,
      value: recruiter.firstName,
      placeholder: "Enter your First Name",
      onchange: (e) => handleChange(e, 'firstName'),
    },
    {
      label: "Last Name",
      error: error.lastName,
      helperText: error.lastName ? error.helperTxtLastName : null,
      value: recruiter.lastName,
      placeholder: "Enter your Last Name",
      onchange: (e) => handleChange(e, 'lastName'),
    },
    {
      label: "E-mail",
      error: error.email,
      helperText: error.email ? error.helperTxtEmail : null,
      value: recruiter.email,
      placeholder: "Enter your E-mail",
      onchange: (e) => handleChange(e, 'email'),
    },
    {
      label: "Phone",
      error: error.phone,
      helperText: error.phone ? error.helperTxtPhone : null,
      value: recruiter.phone,
      placeholder: "Enter your Phone number",
      onchange: (e) => handleChange(e, 'phone'),
    }
  ];
  const dob = recruiter.dob ? dayjs(recruiter.dob) : null;
  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light  border-bottom' style={{ backgroundColor: "#3b489e", height: "4rem" }}>
        <img src={logo} width={130} />
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            {/* <Link to="/panelist/enroll" className='btn btn-secondary' >Panelist Enrollment</Link> */}
          </ul>
        </div>
      </nav>
      <div class="" style={{ height: "600px", overflowY: "scroll", overflowX: "hidden" }}>
        <div class="border" >
          <div class="panel panel-default" style={{ paddingLeft: '230px', paddingRight: '230px', paddingBottom: '60px' }}>
            <div class="panel-heading" >
              <h4 class="panel-title" style={{ textAlign: 'center', paddingTop: '10px', paddingBottom: '10px' }}>Panelist Enrollment Form</h4>
            </div>
            <div class="panel-body">
              <form role="form" onSubmit={handleSubmit}>
                {fields.map((field) => (
                  <>
                    <div class="row">
                      <div class="col-sm-3" style={{ paddingLeft: '30px' }}>
                        <h6 class="mb-0">{field.label}</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <TextField
                          variant="standard"
                          error={field.error}
                          helperText={field.helperText}
                          value={field.value}
                          className="col-12"
                          placeholder={field.placeholder}
                          onChange={field.onchange}
                          style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }}
                        />
                      </div>
                    </div>
                    <hr></hr>
                  </>
                ))}
                <div class="row">
                  <div class="col-sm-3" style={{ paddingLeft: '30px' }}>
                    <h6 class="mb-0">Date of Birth</h6>
                  </div>
                  <div class="col-sm-9 text-secondary" style={{ paddingLeft: '7px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className="ml-2 mt-2"
                        label="Date of Birth"
                        value={dob}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                        slotProps={{
                          textField: {
                            id: 'date-picker-dialog',
                          },
                        }}
                        error={!!dateInputError}
                        helperText={dateInputError}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3" style={{ paddingLeft: '30px' }}>
                    <h6 class="mb-0">Gender</h6>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Male" checked={recruiter.gender === "Male"} onClick={(e) => handleChange(e, 'gender')} />
                      <label class="form-check-label" for="inlineRadio1">Male</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Female" checked={recruiter.gender === "Female"} onClick={(e) => handleChange(e, 'gender')} />
                      <label class="form-check-label" for="inlineRadio2">Female</label>
                    </div>
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3" style={{ paddingLeft: '30px' }}>
                    <h6 class="mb-0">Qualification</h6>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    <TextField
                      variant='standard'
                      error={error.qualification}
                      helperText={error.qualification ? error.helperTxtQualification : null}
                      className="col-12"
                      value={recruiter.qualification}
                      placeholder='Enter your Qualification'
                      style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }}
                      onChange={(e) => handleChange(e, 'qualification')} />
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3" style={{ paddingLeft: '30px' }}>
                    <h6 class="mb-0">Industry Type</h6>
                  </div>
                  <div class="col-sm-9 text-secondary" style={{ paddingRight: '415px' }}>
                    <Select
                      class="css-1s2u09g-control"
                      onChange={(e) => handleIndustry(e, "industryType")}
                      style={{ width: '500px' }}
                      placeholder='Enter...'
                      options={industryOptions} />
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3" style={{ paddingLeft: '30px' }}>
                    <h6 class="mb-0">Experience</h6>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    <TextField
                      variant='standard'
                      error={error.qualification}
                      helperText={error.qualification ? error.helperTxtQualification : null}
                      className="col-12"
                      type='number'
                      value={recruiter.experience}
                      style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }}
                      placeholder='Enter your Experience'
                      onChange={(e) => handleChange(e, 'experience')} />
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3">
                    <h6 class="mb-0" style={{ paddingLeft: '15px' }}>Preferred Technologies</h6>
                  </div>
                  <div class="col-sm-9 text-secondary" style={{ paddingRight: '415px' }}>
                    <Select
                      class="css-1s2u09g-control"
                      isMulti onChange={handleMultiSelect}
                      style={{ width: '500px' }}
                      placeholder='Enter...'
                      options={skillOptions} />
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3" style={{ paddingLeft: '30px' }}>
                    <h6 class="mb-0">Location</h6>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    <TextField
                      variant='standard'
                      error={error.location}
                      helperText={error.location ? error.helperTxtLocation : null}
                      className="col-12"
                      name="location"
                      value={recruiter.location}
                      onChange={(e) => handleChange(e, 'location')}
                      id="location"
                      placeholder="Enter the location"
                      maxlength="1000"
                      autocomplete="off"
                      style={{ height: '30px', width: '250px', opacity: '0.5' }} />
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3" style={{ paddingLeft: '30px' }}>
                    <h6 class="mb-0">Resume</h6>
                  </div>
                  <div class="col-sm-7 text-secondary">
                    <input
                      type="file"
                      name="image"
                      required="true"
                      id="file"
                      style={{ color: '#0075ff', fontSize: '10px' }}
                      onChange={handleResume}>
                    </input>
                    <p style={{ fontSize: '10px', marginTop: '-18px', marginLeft: '170px' }}>
                      (Accepted file formats Docx,Pdf)
                    </p>
                    <span style={{ color: 'red', fontSize: '10px' }}>
                      {inputError}
                    </span>
                  </div>
                  <div className="col-md-2">
                    <button type="submit" style={{ fontSize: '15px' }} className="btn btn-primary">Next</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}
export default RecruiterEnroll;
