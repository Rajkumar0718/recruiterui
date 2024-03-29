import React from "react";
import { Route, Routes } from "react-router-dom";
const RecruiterLogin = React.lazy(() => import("../components/Recruiter/RecruiterLogin"));
const RecruiterEnroll = React.lazy(() => import("../components/Recruiter/RecruiterEnroll"));
const TimeSlotEnrollment= React.lazy(()=>import("../components/Recruiter/TimeSlotEnrollment"))
const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RecruiterLogin />} />
      <Route path='/panelist/enroll' element={<RecruiterEnroll />} />
      <Route path='/panelist/enroll-2' exact  element={<TimeSlotEnrollment />} />
    </Routes>
  )
}

export default RecruiterRoutes
