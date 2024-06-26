import React, { useEffect, useState } from 'react'
import { authHeader, errorHandler, getCurrentUser } from '../../api/Api';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import PanelistPopup from './PanelistPopup';
import { Link } from 'react-router-dom';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // needs additional webpack config!
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Modal } from 'react-bootstrap';
import Button from "@mui/material/Button"
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
const Dashboard = () => {
  const [name, setName] = useState("React");
  const [events, setEvents] = useState([]);
  const [formats, setFormats] = useState('');
  const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true);
  const [candidate, setCandidate] = useState({});
  const [status, setStatus] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [submittedExam, setSubmittedExam] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  useEffect(() => {
    axios.get(`/api2/superadmin/panelist/candidate?email=${getCurrentUser().email}`, { headers: authHeader() })
      .then(res => {
        let event = [];
        _.map(res.data.response, (start, index) => {
          let obj = {};
          obj.id = start.id;
          obj.title = start.candidate.firstName + " " + start.candidate.lastName;
          obj.start = moment(start.startDate).toDate();
          obj.end = addHours(start.startDate).toDate();
          obj.status = start.panelistCandidateStatus;
          obj.feedback = start.panelistFeedBack;
          obj.interviewLink = start.interviewLink;
          obj.desc = start.jobDescription;
          obj.candidateId = start.candidate.candidateId;
          obj.submittedExam = start.submittedExamDto;
          obj.color = 'black'
          obj.email = start.candidate.email;
          obj.examId = start.candidate.examId
          if (index % 2 === 0) {
            obj.bgcolor = 'aliceblue';
          } else {
            obj.bgcolor = '#f8f9fa';
          }
          event.push(obj);
        })
        setEvents(event)
      })
      .catch(error => {
        errorHandler(error);
      })
  }, [])
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const addHours = (startDate) => {
    let end = moment(startDate).add(1, 'hour')
    return end;
  }
  const eventStyleGetter = (event, start, end, isSelected) => {
    var backgroundColor = event.bgcolor;
    var style = {
      backgroundColor: backgroundColor,
      borderRadius: '3px',
      opacity: 0.8,
      color: event.color,
    };
    return {
      style: style
    };
  }
  const Event = ({ event }) => {
    return (
      <div>
        <span>
          <strong>{event.title}</strong>
          {event.desc && ':  ' + event.desc.replace(/(<([^>]+)>)/ig, '')}
        </span>

      </div>
    )
  }
  const conformationHandle = (event, showPopup) => {
    if (showPopup) setShowPopup(false);
    if (!openModalAdd) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }
    setOpenModalAdd(!openModalAdd);
    console.log(event, "Raj Vadakkan")
    setCandidate(event);
  };
  const setLocal = (event) => {
    let exam = JSON.stringify(event.submittedExam);
    localStorage.setItem(event.candidateId, exam);
    localStorage.setItem("examId", event.examId);
    localStorage.setItem("email", event.email);
  };
  const downloadResume = (candidateId, name) => {
    axios.get(` /api2/candidate/resume/${candidateId}`, { headers: authHeader(), responseType: 'blob' })
      .then(res => {
        var url = window.URL.createObjectURL(res.data);
        var anchor = document.createElement("a");
        anchor.download = name + '.pdf';
        anchor.href = url;
        anchor.click();
      }).catch(e => {
        console.error(e)
      })
  }
  const EventAgenda = ({ event, showPopup }) => {
    console.log(event, "eventsa");
    return (

      <span>
        <em style={{ 'color': 'black', 'fontWeight': 'bold' }}>Candidate Name: </em><span>{event.title}</span><br />
        <span><b>Job Description: </b>{event._def?.extendedProps?.desc?.replace(/(<([^>]+)>)/ig, '')}</span><br />
        <span><b>{!event.status ? 'Interview Link:' : 'Interview :'} </b>{!event.status ? <a href={event?._def?.extendedProps?.interviewLink} target="_blank">{event._def?.extendedProps?.interviewLink}</a> : (event.status == "Not_Show" ? <a>Not Show</a> : <a>Completed</a>)}</span><br />
        <button onClick={() => conformationHandle(event, showPopup)} style={{ cursor: 'pointer' }} className='btn btn-sm btn-primary'>Feedback</button>
        {event.submittedExam ? <Link to={{ pathname: `/panelist/program/result/${event?._def?.extendedProps?.candidateId}`, state: { candidateEmail: event.email, examId: event.examId } }} target={'_blank'}><button onClick={() => setLocal(event)} style={{ cursor: 'pointer', marginLeft: '10px' }} className='btn btn-sm btn-primary'>View Code</button></Link> : ""}
        <button onClick={() => downloadResume(event?._def?.extendedProps?.candidateId, event.title)} style={{ cursor: 'pointer', marginLeft: '10px' }} className='btn btn-sm btn-primary'><i class="fa fa-download"></i> Resume</button>
      </span>
    )
  }
  const handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      setOpenModalAdd(!openModalAdd)
      axios.get(`/api2/superadmin/panelist/candidate?email=${getCurrentUser().email}`, { headers: authHeader() })
        .then(res => {
          let event = [];
          _.map(res.data.response, (start, index) => {
            let obj = {};
            obj.id = start.id;
            obj.title = start.candidate.firstName + " " + start.candidate.lastName;
            obj.start = moment(start.startDate).toDate();
            obj.end = addHours(start.startDate).toDate();
            obj.status = start.panelistCandidateStatus;
            obj.feedback = start.panelistFeedBack;
            obj.interviewLink = start.interviewLink;
            obj.desc = start.jobDescription;
            obj.candidateId = start.candidate.candidateId;
            obj.submittedExam = start.submittedExamDto;
            obj.color = 'black'
            obj.email = start.candidate.email;
            obj.examId = start.candidate.examId
            if (index % 2 === 0) {
              obj.bgcolor = 'aliceblue';
            } else {
              obj.bgcolor = '#f8f9fa';
            }
            event.push(obj);
          })
          setEvents(event)
        })
        .catch(error => {
          errorHandler(error);
        })

    }
  };


  const onCloseModal = () => {
    setOpenModalAdd(!openModalAdd)
    axios.get(`/api2/superadmin/panelist/candidate?email=${getCurrentUser().email}`, { headers: authHeader() })
      .then(res => {
        let event = [];
        _.map(res.data.response, (start, index) => {
          let obj = {};
          obj.id = start.id;
          obj.title = start.candidate.firstName + " " + start.candidate.lastName;
          obj.start = moment(start.startDate).toDate();
          obj.end = addHours(start.startDate).toDate();
          obj.status = start.panelistCandidateStatus;
          obj.feedback = start.panelistFeedBack;
          obj.interviewLink = start.interviewLink;
          obj.desc = start.jobDescription;
          obj.candidateId = start.candidate.candidateId;
          obj.submittedExam = start.submittedExamDto;
          obj.color = 'black'
          obj.email = start.candidate.email;
          obj.examId = start.candidate.examId
          if (index % 2 === 0) {
            obj.bgcolor = 'aliceblue';
          } else {
            obj.bgcolor = '#f8f9fa';
          }
          event.push(obj);
        })
        setEvents(event)
      })
      .catch(error => {
        errorHandler(error);
      })
  };
  return (
    <div>
      <div className="col-lg-12 col-sm-12 col-md-12">
        <div className="card">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin]}
            initialView="listMonth"
            events={events}
            initialDate={moment().toDate()}
            eventDisplay="list-item"
            eventContent={({ event, view }) => {
              if (view.type === 'listMonth') {
                return <EventAgenda event={event} />;
              } else {
                const eve = event._def.extendedProps;
                let { title } = event
                return (
                  <div className='event-display'>
                    <ul>
                      <li style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {title}
                      </li>
                    </ul>
                  </div>
                )
              }
            }}
            headerToolbar={{
              left: 'prev,next,today',
              center: 'title',
              right: 'dayGridMonth,listMonth'
            }}
            stickyHeaderDates
            aspectRatio={2}
            eventClick={({ event, view }) => {
              if (view.type != 'listMonth') {
                return handleEventClick(event);
              }
            }}
            // eventClick={(event) => window.alert(<EventAgenda event={event}/>)}
            // select={(event) => window.alert("Date Seelct")}
            views={{
              listMonth: { buttonText: 'Agenta' }
            }}
            themeSystem="bootstrap"
          />

          <Modal show={showPopup} onHide={closePopup}>
            <Modal.Header closeButton>
              <Modal.Title>Event Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedEvent && <EventAgenda showPopup={showPopup} event={selectedEvent} />}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closePopup}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          {openModalAdd ? (
            <PanelistPopup
              candidate={{
                id: candidate.id,
                name: candidate.title,
                panelistCandidateStatus: candidate._def?.extendedProps?.status,
                panelistFeedBack: candidate._def?.extendedProps?.feedback,
              }}
              onCloseModal={onCloseModal}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div >
  )
}

export default Dashboard
