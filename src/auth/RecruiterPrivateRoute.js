// import React from 'react';
// import { Navigate } from 'react-router-dom';


// class RecruiterPrivateRoute extends React.Component {

//     render() {
//         const Component = this.props.component;
//         const isAuthenticated = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : localStorage.getItem('token');
//         return isAuthenticated ? (<Component />) : (<Navigate to={{ pathname: '/' }} />);
//     }

// }
// export default RecruiterPrivateRoute;
// import React from 'react';
// import { Navigate, Route, Routes } from 'react-router-dom';


// function RecruiterPrivateRoute({ children, ...rest }) {
//     const isAuthenticated = sessionStorage.getItem('token') || localStorage.getItem('token');

//     return (

//         <Route {...rest} element={isAuthenticated ? children : <Navigate to="/" />} />

//     );
// }

// export default RecruiterPrivateRoute;

import React from 'react'
import { Navigate, Outlet, useLocation } from "react-router-dom";
const RecruiterPrivateRoute = () => {
    const location = useLocation();
    const isAuthenticated = sessionStorage.getItem('token') || localStorage.getItem('token');
  return (
    isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default RecruiterPrivateRoute
