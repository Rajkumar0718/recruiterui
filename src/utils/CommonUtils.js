import React from 'react'
import { useLocation, useParams } from 'react-router';
import { useNavigate } from 'react-router-dom'
export function withLocation(Component) {
  return (props) => {
      const location = useLocation();
      const params = useParams();
      const navigation = useNavigate();
      return <Component {...props} params={params} location={location} navigate={navigation} />;
  };
};
