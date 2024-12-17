//once user logged in, even if the user change the route to other such as
// login,signup then until the token is on local storage the user will be redirected to the homepage

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"

const RefreshHandler = ({setIsAuthenticated}) => {
    
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('token')){
            setIsAuthenticated(true);
            if(location.pathname === '/' || 
                location.pathname === '/login' ||
                location.pathname === './signup'
            ){
                navigate('/dashboard', {replace : false}) ;
            }
        }
    },[ location, navigate, setIsAuthenticated])
  return (
    null
  )
}

export default RefreshHandler