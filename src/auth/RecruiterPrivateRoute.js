import React from 'react';
import { Navigate } from 'react-router-dom';


class RecruiterPrivateRoute extends React.Component {
    render() {
        const Component = this.props.component;
        const isAuthenticated = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : localStorage.getItem('token');
        return isAuthenticated ? (<Component />) : (<Navigate to={{ pathname: '/' }} />);
    }

}
export default RecruiterPrivateRoute;
