import axios from 'axios'; 
import { setAlert } from './alert'; 
import setAuthToken from '../utils/setAuthToken'; 

import {
  GET_PROFILE, 
  PROFILE_ERROR
} from './types'; 

// Get current users profile 
export const getCurrentProfile = () => async dispatch => { 
  if(localStorage.token && localStorage.token !== undefined) {
    console.log('Retreiving token from local storage...');
    setAuthToken(localStorage.token); 
  }
  try {
    const res = await axios.get('http://localhost:5000/api/profile/me'); 

    dispatch({
      type: GET_PROFILE, 
      payload: res.data 
    }); 
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR, 
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}

// Create / Update Profile 
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const res = await axios.post('http://localhost:5000/api/profile', formData, config); 
    
    console.log('Received response from axios.post http://localhost:5000/api/profile'); 
    
    dispatch({
      type: GET_PROFILE, 
      payload: res.data 
    }); 
    
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')); 

    if(!edit) { // Upon creating new profile, redirect user to dashboard 
      history.push('/dashboard'); // Need to use history.push() inside an action
    }
  } catch (error) {
    const err = error.response.data.errors; 

    if(err) { 
      console.log(`Setting alerts for ${err.length} errors...`); 

      err.forEach(e => dispatch(setAlert(e.msg, 'danger'))); 
    }

    dispatch({
      type: PROFILE_ERROR, 
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}; 