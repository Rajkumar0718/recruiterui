import React from "react";
import { Route, Routes } from "react-router-dom";
const RecruiterLogin = React.lazy(() => import("../components/Recruiter/RecruiterLogin"));
const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RecruiterLogin />} />
    </Routes>
  )
}

export default RecruiterRoutes
