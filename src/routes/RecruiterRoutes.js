import React from "react";
import { Route, Routes } from "react-router-dom";
import RecruiterPrivateRoute from '../auth/RecruiterPrivateRoute';
import RecruiterLayout from "../container/RecruiterLayout";
const RecruiterLogin = React.lazy(() => import("../components/Recruiter/RecruiterLogin"));
const RecruiterEnroll = React.lazy(() => import("../components/Recruiter/RecruiterEnroll"));
const TimeSlotEnrollment = React.lazy(() => import("../components/Recruiter/TimeSlotEnrollment"))
const LoginRegistration = React.lazy(() => import("../components/Recruiter/LoginRegistration"))
const Dashboard = React.lazy(() => import('../components/Recruiter/Dashboard'))
const TimeSlot = React.lazy(() => import('../components/Recruiter/TimeSlot'))
const ContactAdmin = React.lazy(() => import('../components/Recruiter/ContactAdmin'))
const RecruiterProfile = React.lazy(() => import('../components/Recruiter/RecruiterProfile'))
const ProgramResult = React.lazy(() => import('../components/Recruiter/ProgramResult'))
const Payment = React.lazy(() => import('../components/Recruiter/Payment'))
const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RecruiterLogin />} />
      <Route path='/panelist/login' exact element={<RecruiterLogin />} />
      <Route path='/panelist/enroll' element={<RecruiterEnroll />} />
      <Route path='/panelist/enroll-2' exact element={<TimeSlotEnrollment />} />
      <Route path='/panelist/set/password/:token/:recruiterId' exact element={<LoginRegistration />} />

      <Route element={<RecruiterPrivateRoute ></RecruiterPrivateRoute>}>
        <Route path='/panelist/program/result/:candidate_id' exact element={<ProgramResult />} />
      </Route>


      <Route path='/panelist/' element={<RecruiterLayout />}>
        <Route element={<RecruiterPrivateRoute ></RecruiterPrivateRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="timeSlot" element={<TimeSlot />} />
          <Route path="contactAdmin" element={<ContactAdmin />} />
          <Route path="profile" element={<RecruiterProfile />} />
          <Route path="Payment" element={<Payment />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default RecruiterRoutes
