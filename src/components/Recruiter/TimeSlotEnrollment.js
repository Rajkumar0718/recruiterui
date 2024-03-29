import React, { useEffect, useRef, useState } from 'react'
import logo from '../../assets/images/LOGO.svg'
import _ from "lodash";
import { errorHandler } from '../../api/Api';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField } from "@mui/material";
import dayjs from 'dayjs';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import EnrollmentCompletePopup from './EnrollmentCompletePopup';
import { useNavigate } from 'react-router-dom';
const TimeSlotEnrollment = () => {
  const navigate = useNavigate();
  const [isDisable, setIsDisable] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [week, setWeek] = useState(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']);
  const [toDate, setToDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([]);
  const [recruiterId, setRecruiterId] = useState('');
  const [timeSlot, setTimeSlot] = useState({ selectedDays: [] });
  const [start, setStart] = useState(new Date().getTime());
  const [end, setEnd] = useState(new Date().getTime());
  const [slots, setSlots] = useState({
    sunday: '',
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: ''
  });
  const didMountRef = useRef(false);
  const isSelected = (day) => {
    return selectedDays.includes(day) ? 'true' : 'false';
  };
  useEffect(() => {
    if (didMountRef.current) {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user !== null) {
        const id = user.id;
        setRecruiterId(id);
        axios.get(`/api1/timeSlot/list?recruiterId=${id}`)
          .then((mur) => {
            const timeSlotData = timeSlot;
            if (mur.data.response.length !== 0) {
              setIsDisable(false);
            }
            timeSlotData.selectedDays = mur.data.response;
            setTimeSlot(timeSlotData);
            console.log(mur);
          })
          .catch(error => {
            errorHandler(error);
          });
      } else {
        // Redirect to login page if user is null
        // Assuming you have access to history prop
        // this.props.history.push('/panelist/login');
      }
    } else {
      didMountRef.current = true;
    }
  }, [timeSlot, setSelectedDays, setIsDisable, setRecruiterId]);




  const handleClick = (day) => {
    if (selectedDays.includes(day)) {
      const updatedSelectedDays = selectedDays.filter(selectedDay => selectedDay !== day);
      setSelectedDays(updatedSelectedDays);
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  const addSlot = () => {
    axios.post(`/api1/timeSlot/add`, { selectedDays, recruiterId })
      .then(() => {
        toast.success('Updated Successfully!');
        resetState();
        // Call componentDidMount-like logic after adding slot
        // Assuming you want to refresh data after adding slot
        axios.get(`/api1/timeSlot/list?recruiterId=${recruiterId}`)
          .then((mur) => {
            const timeSlotData = timeSlot;
            if (mur.data.response.length !== 0) {
              setIsDisable(false);
            }
            timeSlotData.selectedDays = mur.data.response;
            setTimeSlot(timeSlotData);
            console.log(mur);
          })
          .catch(error => {
            errorHandler(error);
          });
      })
      .catch(error => {
        errorHandler(error);
      });
  };
  const resetState = () => {
    setSelectedDays([]);
  };
  const handleTimeChange = (e, key, value) => {
    const dateObject = e.toDate();
    if (value === 'start') {
      setStart(dateObject.getTime());
    } else if (value === 'end') {
      setEnd(dateObject.getTime());
    }
  };
  const concat = () => {
    const temp = { ...slots };
    temp.sunday = temp.monday = temp.tuesday = temp.wednesday = temp.thursday = temp.friday = temp.saturday = '';
    _.map(timeSlot.selectedDays, (day) => {
      if (day.day === 'SUNDAY') {
        temp.sunday = temp.sunday + `[${day.startTime} - ${day.endTime}] `;
      }
      if (day.day === 'MONDAY') {
        temp.monday = temp.monday + `[${day.startTime} - ${day.endTime}] `;
      }
      if (day.day === 'TUESDAY') {
        temp.tuesday = temp.tuesday + `[${day.startTime} - ${day.endTime}] `;
      }
      if (day.day === 'WEDNESDAY') {
        temp.wednesday = temp.wednesday + `[${day.startTime} - ${day.endTime}] `;
      }
      if (day.day === 'THURSDAY') {
        temp.thursday = temp.thursday + `[${day.startTime} - ${day.endTime}] `;
      }
      if (day.day === 'FRIDAY') {
        temp.friday = temp.friday + `[${day.startTime} - ${day.endTime}] `;
      }
      if (day.day === 'SATURDAY') {
        temp.saturday = temp.saturday + `[${day.startTime} - ${day.endTime}] `;
      }
      return null;
    });
    return temp;
  };
  const showTable = () => {
    const slot = concat();
    return (
      <tbody>
        <tr>
          <td>{week[0]}</td>
          <td>{slots.sunday}</td>
        </tr>
        <tr>
          <td>{week[1]}</td>
          <td>{slots.monday}</td>
        </tr>
        <tr>
          <td>{week[2]}</td>
          <td>{slots.tuesday}</td>
        </tr>
        <tr>
          <td>{week[3]}</td>
          <td>{slots.wednesday}</td>
        </tr>
        <tr>
          <td>{week[4]}</td>
          <td>{slots.thursday}</td>
        </tr>
        <tr>
          <td>{week[5]}</td>
          <td>{slots.friday}</td>
        </tr>
        <tr>
          <td>{week[6]}</td>
          <td>{slots.saturday}</td>
        </tr>
      </tbody>
    );
  };
  const skipHandle = () => {
    onCloseModalAdd();
    toast.success('Successfully Enrolled');
  };
  const onCloseModalAdd = () => {
    sessionStorage.clear();
    navigate('/panelist/login')
  };
  const conformationHandle = () => {
    if (!openModalAdd) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }
    setOpenModalAdd(!openModalAdd)
  };
  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal fade show') {
      if (openModal === true) {
        setOpenModal(!openModal);
        // Refresh data after closing modal
        axios.get(`/api1/timeSlot/list?recruiterId=${recruiterId}`)
          .then((mur) => {
            const timeSlotData = timeSlot;
            if (mur.data.response.length !== 0) {
              setIsDisable(false);
            }
            timeSlotData.selectedDays = mur.data.response;
            setTimeSlot(timeSlotData);
            console.log(mur);
          })
          .catch(error => {
            errorHandler(error);
          });
      } else {
        setOpenModalAdd(!openModalAdd);
        // Refresh data after closing modal
        axios.get(`/api1/timeSlot/list?recruiterId=${recruiterId}`)
          .then((mur) => {
            const timeSlotData = timeSlot;
            if (mur.data.response.length !== 0) {
              setIsDisable(false);
            }
            timeSlotData.selectedDays = mur.data.response;
            setTimeSlot(timeSlotData);
            console.log(mur);
          })
          .catch(error => {
            errorHandler(error);
          });
      }
    }
  };
  return (
    <main class="main-content bcg-clr">
      <nav className='navbar navbar-expand-lg navbar-light  border-bottom' style={{ backgroundColor: "#3b489e", height: "4rem" }}>
        <img src={logo} width={130} />
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            {/* <Link to="/panelist/enroll" className='btn btn-secondary' >Panelist Enrollment</Link> */}
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
                      <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label="Start-Time"
                            value={dayjs(start)}
                            onChange={(e) => handleTimeChange(e, 'startTime', 'start')}
                            renderInput={(params) => <TextField {...params} />}
                            ampm={true}
                            inputFormat="hh:mm"
                            views={['hours', 'minutes']}
                            minutesStep={5}
                            secondsStep={5}
                            viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                      <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label="End-Time"
                            value={dayjs(end)}
                            onChange={(e)=>handleTimeChange(e, 'endTime', 'end')}
                            renderInput={(params) => <TextField {...params} />}
                            ampm={true}
                            inputFormat="hh:mm a"
                            views={['hours', 'minutes']}
                            minutesStep={5}
                            secondsStep={5}
                            viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                            }}
                          />
                        </LocalizationProvider>


                      </div>
                      <div style={{ marginLeft: '450px', marginTop: '-30px' }}>
                        {_.map(week, (day, index) => {
                          return <span className={`${isSelected(day) === "true" ? "week" : "notSelected"}`} onClick={() => handleClick(day, index)}>{day}</span>
                        })}
                      </div>
                    <div type="button" style={{ marginLeft: '1100px', marginTop: '-25px' }} onClick={() => addSlot()}><i class="fa fa-plus-circle" style={{ color: '#007bff' }}></i></div>
                  </div>
                </div>
                {timeSlot.selectedDays.length > 0 ? (
                  <div style={{ paddingLeft: "20%", paddingRight: "20%", paddingTop: "2%" }}>
                    <table class="table table-bordered" style={{ fontSize: "13px", textAlign: "center" }}>
                      <thead>
                        <tr>
                          <th>DAYS</th>
                          <th>SLOT TIMINGS</th>
                        </tr>
                      </thead>
                      {showTable()}
                    </table>
                  </div>) : null}
                <div className="row">
                  <div className="col-md-10">
                  </div>
                  <div className="col-md-2">
                    <button onClick={skipHandle} className="btn btn-primary" >Skip</button>
                    <button onClick={conformationHandle} className="btn btn-primary" disabled={isDisable} style={{ marginLeft: '15px' }}>Submit</button>
                    {openModalAdd ? (
                      <EnrollmentCompletePopup
                        onCloseModalAdd={onCloseModalAdd}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div></div>
    </main>
  )
}
export default TimeSlotEnrollment
