import React, { Component } from 'react';
import '../../assets/css/AdminDashboard.css'
// import DateFnsUtils from '@date-io/date-fns';
import { toast } from 'react-toastify';
import axios from 'axios';
import { errorHandler } from '../../api/Api';
import icon from '../../assets/images/LOGO.svg';
import _ from "lodash";
import { withLocation } from '../../utils/CommonUtils';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField } from "@mui/material";
import dayjs from 'dayjs';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import EnrollmentCompletePopup from './EnrollmentCompletePopup';
class TimeSlotEnrollment extends Component {

  state = {
    isDisable: true,
    openModal: false,
    openModalAdd: false,
    week: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
    toDate: new Date(),
    fromDate: new Date(),
    selectedDays: [],
    recruiterId: '',
    timeSlot: {
      selectedDays: [],
    },
    start: new Date().getTime(),
    end: new Date().getTime(),
    slots: {
      sunday: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: ''
    }
  }

  isSelected = (day) => {
    if (this.state.selectedDays.includes(day)) {
      return (day = "true");
    } else {
      return (day = "false");
    }
  }

  componentDidMount() {

    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user != null) {
      let id = user.id;
      this.setState({ recruiterId: id })
      axios.get(`/api1/timeSlot/list?recruiterId=${id}`)
        .then(mur => {
          const timeSlot = this.state.timeSlot;
          if (mur.data.response.length != 0) {
            this.setState({ isDisable: false });
          }
          timeSlot.selectedDays = mur.data.response;
          this.setState({ timeSlot: timeSlot });
        })
    }
    else {
      this.props.navigate('/panelist/login');
    }
  }

  skipHandle = () => {
    this.onCloseModalAdd();
    toast.success("Successfully Enrolled")
  }

  addSlot = () => {
    axios.post(`/api1/timeSlot/add`, this.state)
      .then(res => {
        toast.success("Updated Successfully!")
        this.resetState()
        this.componentDidMount();
      }).catch(error => {
        errorHandler(error);
      });
  }


  resetState() {
    this.setState({
      selectedDays: []
    })
  }

  handleClick = (day) => {
    if (this.state.selectedDays.includes(day)) {
      let index = this.state.selectedDays.indexOf(day);
      let eliminate = [...this.state.selectedDays];
      eliminate.splice(index, 1);
      this.setState({ selectedDays: eliminate })
    } else {
      this.setState({ selectedDays: [...this.state.selectedDays, day] })
    }
  }

  handleTimeChange = (e, key, value) => {

    this.setState({ [value]: e.valueOf() })
  }

  conformationHandle = () => {
    if (!this.state.openModalAdd) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState({ openModalAdd: !this.state.openModalAdd });
  };

  onClickOpenModel = (data) => {
    if (!this.state.openModal) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState({ openModal: !this.state.openModal });
    this.setState({ modalSection: data });
  };

  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      if (this.state.openModal === true) {
        this.setState({ openModal: !this.state.openModal });
        this.componentDidMount();
      }
      else {
        this.setState({ openModalAdd: !this.state.openModalAdd });
        this.componentDidMount();
      }
    }
  };

  onCloseModalAdd = () => {
    sessionStorage.clear();
    this.props.navigate('/panelist/login');
  };

  concat = () => {
    const temp = this.state.slots;
    temp.sunday = temp.monday = temp.tuesday = temp.wednesday = temp.thursday = temp.friday = temp.saturday = '';
    {
      _.map(this.state.timeSlot.selectedDays, (day, index) => {
        if (day.day === 'SUNDAY') {
          temp.sunday = temp.sunday + '[' + day.startTime + ' - ' + day.endTime + '] ';
        }
        if (day.day === 'MONDAY') {
          temp.monday = temp.monday + '[' + day.startTime + ' - ' + day.endTime + '] ';
        }
        if (day.day === 'TUESDAY') {
          temp.tuesday = temp.tuesday + '[' + day.startTime + ' - ' + day.endTime + '] ';
        }
        if (day.day === 'WEDNESDAY') {
          temp.wednesday = temp.wednesday + '[' + day.startTime + ' - ' + day.endTime + '] ';
        }
        if (day.day === 'THURSDAY') {
          temp.thursday = temp.thursday + '[' + day.startTime + ' - ' + day.endTime + '] ';
        }
        if (day.day === 'FRIDAY') {
          temp.friday = temp.friday + '[' + day.startTime + ' - ' + day.endTime + '] ';
        }
        if (day.day === 'SATURDAY') {
          temp.saturday = temp.saturday + '[' + day.startTime + ' - ' + day.endTime + '] ';
        }
      })
    }
    return (temp);
  }

  showTable = () => {
    const slot = this.concat();

    return (
      <tbody>
        <tr>
          <td>{this.state.week[0]}</td>
          <td>{this.state.slots.sunday}</td>
        </tr>
        <tr>
          <td>{this.state.week[1]}</td>
          <td>{this.state.slots.monday}</td>
        </tr>
        <tr>
          <td>{this.state.week[2]}</td>
          <td>{this.state.slots.tuesday}</td>
        </tr>
        <tr>
          <td>{this.state.week[3]}</td>
          <td>{this.state.slots.wednesday}</td>
        </tr>
        <tr>
          <td>{this.state.week[4]}</td>
          <td>{this.state.slots.thursday}</td>
        </tr>
        <tr>
          <td>{this.state.week[5]}</td>
          <td>{this.state.slots.friday}</td>
        </tr>
        <tr>
          <td>{this.state.week[6]}</td>
          <td>{this.state.slots.saturday}</td>
        </tr>
      </tbody>
    );
  }

  render() {
    return (
      <main class="main-content bcg-clr">
        <nav className='navbar navbar-expand-lg navbar-light bg-light border-bottom' style={{ paddingTop: '0px' }}>
          <img src={icon} width={130}></img>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            </ul>
          </div>
        </nav>
        <div>
          <div class="container-fluid cf-1">
            <div className="card-header-new">
              <span>
                TimeSlot
              </span>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-border-cr">
                  <div class="send-header">
                    <div class="mb-3">
                      <label class="form-label">Time (hrs)</label>
                      <div style={{ marginLeft: '155px', marginTop: '-50px', display:"flex",flexDirection:"row"}}>
                        <div  style={{position:"relative",right:"3rem",width:"13rem"}}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker']}>
                              <TimePicker
                                label="Start-Time"
                                value={dayjs(this.state.start)}
                                onChange={(e) => this.handleTimeChange(e, 'startTime', 'start')}
                                renderInput={(params) => <TextField {...params} />}
                                ampm={true}
                                inputFormat="hh:mm"
                                views={['hours', 'minutes']}
                                // minutesStep={5}
                                secondsStep={5}
                                viewRenderers={{
                                  hours: renderTimeViewClock,
                                  minutes: renderTimeViewClock,
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                        <div style={{position:"relative",right:"1rem",width:"13rem"}} >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker']}>
                              <TimePicker
                                label="End-Time"
                                value={dayjs(this.state.end)}
                                onChange={(e) => this.handleTimeChange(e, 'endTime', 'end')}
                                renderInput={(params) => <TextField {...params} />}
                                ampm={true}
                                inputFormat="hh:mm"
                                views={['hours', 'minutes']}
                                // minutesStep={5}
                                secondsStep={5}
                                viewRenderers={{
                                  hours: renderTimeViewClock,
                                  minutes: renderTimeViewClock,
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                        <div style={{position:"relative",top:"1.5rem"}}>
                          {_.map(this.state.week, (day, index) => {
                            return <span className={`${this.isSelected(day) === "true" ? "week" : "notSelected"}`} onClick={() => this.handleClick(day, index)}>{day}</span>
                          })}
                        </div>
                      </div>
                      <div type="button" style={{ marginLeft: '1100px', marginTop: '-25px' }} onClick={() => this.addSlot()}><i class="fa fa-plus-circle" style={{ color: '#007bff' }}></i></div>
                    </div>
                  </div>
                  {this.state.timeSlot.selectedDays.length > 0 ? (
                    <div style={{ paddingLeft: "20%", paddingRight: "20%", paddingTop: "2%" }}>
                      <table class="table table-bordered" style={{ fontSize: "13px", textAlign: "center" }}>
                        <thead>
                          <tr>
                            <th>DAYS</th>
                            <th>SLOT TIMINGS</th>
                          </tr>
                        </thead>
                        {this.showTable()}
                      </table>
                    </div>) : null}
                  <div className="row">
                    <div className="col-md-10">
                    </div>
                    <div className="col-md-2">
                      <button onClick={this.skipHandle} className="btn btn-primary" >Skip</button>
                      <button onClick={this.conformationHandle} className="btn btn-primary" disabled={this.state.isDisable} style={{ marginLeft: '15px' }}>Submit</button>
                      {this.state.openModalAdd ? (
                        <EnrollmentCompletePopup
                          onCloseModalAdd={this.onCloseModalAdd}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
export default withLocation(TimeSlotEnrollment);
