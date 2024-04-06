import React, { useState, Suspense } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';

import Header from '../components/Recruiter/Header';
import ZZ5H from '../assets/images/ZZ5H.gif';
const RecruiterLayout = () => {
  const [showSidenav, setShowSidenav] = useState(false);
  const navigation = useNavigate();
  const logOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigation('/');
    window.location.reload();
  }
  const toggleButtonClicked = () => {
    setShowSidenav(!showSidenav)
  }
  return (
    <>
      <div className="d-flex" id="wrapper">
        <div id="page-content-wrapper">
          <Header onClickToggled={toggleButtonClicked} logOut={() => logOut()} showSidenav={showSidenav} />
          <div className="container-fluid">
            <Suspense fallback={<div className="animated fadeIn pt-1 text-center"><img src={ZZ5H}></img></div>}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </>

  )
}

export default RecruiterLayout
