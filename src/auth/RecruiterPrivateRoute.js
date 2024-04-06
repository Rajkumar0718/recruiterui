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
import React from 'react';
import { useNavigate } from 'react-router-dom';

function RecruiterPrivateRoute({ component: Component, ...rest }) {
    const Navigate = useNavigate();
    const isAuthenticated = sessionStorage.getItem('token') || localStorage.getItem('token');

    return isAuthenticated ? <Component {...rest} /> : Navigate("/");
}

export default RecruiterPrivateRoute;
