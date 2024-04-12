import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { authHeader, errorHandler } from '../../api/Api';
import { toast } from 'react-toastify';

const Payment = () => {

  const [amount, setAmount] = useState('');
  const [hour, setHour] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const [id, setId] = useState('');
  useEffect(() => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    let recruiterId = user.id;
    setRecruiterId(recruiterId)
    axios.get(`/api1/payment/get?recruiterId=${recruiterId}`, { headers: authHeader() })
      .then(res => {
        if (res.data.response != null) {
          setAmount(res.data.response.amount)
          setHour(res.data.response.hour)
          setId(res.data.response.id)
        }
      })
      .catch(error => {
        errorHandler(error);
      })
  }, [recruiterId])
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`/api1/payment/save`, { amount, hour, totalAmount, recruiterId, id }, { headers: authHeader() })
      .then(res => {
        toast.success("Added Successfully!");
      })
      .catch(error => {
        errorHandler(error);
      });
  }

  return (
    <main class="main-content bcg-clr">
      <div>
        <div class="container-fluid cf-1">
          <div className="card-header-new">
            <span>
              Payment Option
            </span>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="table-border-cr">
                <form class="email-compose-body" onSubmit={handleSubmit}>
                  <div class="send-header">
                    <div class="row">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Total hours</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input type='number' style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }} value={hour} placeholder='Total hours' onChange={(e) => setHour(e.target.value)}></input>
                      </div>
                    </div>
                    <hr></hr>
                    <div class="row">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Charge per hour</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input type='number' style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }} value={amount} placeholder='Enter amount' onChange={(e) => setAmount(e.target.value)}></input>
                      </div>
                    </div>
                    <hr></hr>
                    <div class="row">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Total Charge</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <input type='number' style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }} value={hour * amount}></input>
                      </div>
                    </div>
                    <hr></hr>
                    <div class="row">
                      <div class="col-sm-3">
                        <h6 class="mb-0">Payment mode</h6>
                      </div>
                      <div class="col-sm-9 text-secondary">
                        <i class="fa fa-university" aria-hidden="true"> select bank</i>
                      </div>
                    </div>
                    <hr></hr>
                  </div>
                  <div className="form-group row">
                    <button type="submit" className="btn btn-primary" style={{ marginLeft: '12px' }}>Send</button>
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

export default Payment
