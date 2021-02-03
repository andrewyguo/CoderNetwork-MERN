import axios from 'axios'; 
import { setAlert } from './alert';
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR } from './types'; 
import setAuthToken from '../utils/setAuthToken'; 

// Load User 
export const loadUser = () => async dispatch => {
  if(localStorage.token) {
    setAuthToken(localStorage.token); 
    console.log(localStorage.token); 
  }
  try {
    const res = await axios.get('http://localhost:5000/api/auth'); 

    dispatch({
      type: USER_LOADED, 
      payload: res.data 
    }); 
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    }); 
  }
}

// Register User 
export const register = ({ name, email, password }) => async dispatch => { 
  const config = {
    headers: { 
      'Content-Type': 'application/json' 
    }
  }
  const body = JSON.stringify({ name, email, password }); 

  try {
    // axios.defaults.baseURL = 'http://localhost:5000'; // Set to 5000 so axios will not go to App.js base URL to make API Requests 

    const res = await axios.post('http://localhost:5000/api/users', body, config); 
    console.log(`res: ${res}`); 
    dispatch({
      type: REGISTER_SUCCESS, 
      payload: res.data 
    });
  } catch (error) {
    const err = error.response.data.errors; 

    if(err) { 
      err.forEach(e => dispatch(setAlert(e.msg, 'danger'))); 
    }

    dispatch({
      type: REGISTER_FAIL
    }); 
  }
}