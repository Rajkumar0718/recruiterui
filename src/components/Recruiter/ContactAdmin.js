import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { authHeader } from '../../api/Api';
const ContactAdmin = () => {
  const [adminName, setAdminName] = useState('SuperAdmin');
  const [phone, setPhone] = useState('8963258741');
  const [email, setEmail] = useState('superadmin@gmail.com');
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
        setRecruiter(res.data.response);
      })
      .catch(error => {
        console.error('Error fetching recruiter data:', error);
      });
console.log(recruiter.verifiedStatus,"sss");
  }, []);

  return (
    <main class="main-content bcg-clr">
      <div>
        <div class="container-fluid cf-1">
          <div className="card-header-new">
            <span>
              Admin Details
            </span>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="table-border-cr">
                <form class="email-compose-body" >
                  <div class="send-header">
                    <div class="row">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Admin Name</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <span>{adminName}</span>
                      </div>
                    </div>
                    <hr></hr>
                    <div class="row">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Contact Number</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <span>{phone}</span>
                      </div>
                    </div>
                    <hr></hr>
                    <div class="row">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Email</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <span>{email}</span>
                      </div>
                    </div>
                    <hr></hr>
                    <div class="row">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Your verification status</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">

                        <span className={recruiter.verifiedStatus == "VERIFIED" ? "badge bg-success" : "badge bg-danger"}>{recruiter.verifiedStatus == "NOTVERIFIED" ? "NOT VERIFIED" : "VERIFIED"}</span>
                      </div>
                    </div>
                    <hr></hr>
                  </div>
                  <div className="form-group row">

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ContactAdmin
