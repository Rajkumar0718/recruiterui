import React from 'react';
import { Redirect } from 'react-router-dom';

class RecruiterPrivateRoute extends React.Component{
    render(){
        const Component = this.props.component;
        const isAuthenticated =sessionStorage.getItem('token')?sessionStorage.getItem('token'):localStorage.getItem('token');
        return isAuthenticated ? (<Component/>) : (<Redirect to ={{pathname:'/'}}/>);
    }

}
export default RecruiterPrivateRoute;
