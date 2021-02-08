import axios from 'axios'; 
import { setAlert } from './alert'; 
import setAuthToken from '../utils/setAuthToken'; 

import {
  GET_PROFILE, 
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE, 
  ACCOUNT_DELETED, 
  CLEAR_PROFILE, 
  GET_REPOS
} from './types'; 

// Get current user profile 
export const getCurrentProfile = () => async dispatch => { 
  // if(localStorage.token && localStorage.token !== undefined) {
  //   console.log('Retreiving token from local storage...');
  //   setAuthToken(localStorage.token); 
  // }
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

// Get all user profile 
export const getProfiles = () => async dispatch => { 
  // if(localStorage.token && localStorage.token !== undefined) {
  //   console.log('Retreiving token from local storage...');
  //   setAuthToken(localStorage.token); 
  // }
  dispatch({ type: CLEAR_PROFILE }); // Prevent flashing of past user's profile 
  try {
    const res = await axios.get('http://localhost:5000/api/profile'); 
    console.log('getting profiles'); 
    console.log(res.data); 
    dispatch({
      type: GET_PROFILES, 
      payload: res.data 
    }); 
  } catch (error) {
    console.log(error); 
    dispatch({
      type: PROFILE_ERROR, 
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}

// Get profile by User ID 
export const getProfileById = (userID) => async dispatch => { 
  // if(localStorage.token && localStorage.token !== undefined) {
  //   console.log('Retreiving token from local storage...');
  //   setAuthToken(localStorage.token); 
  // }
  try {
    const res = await axios.get(`http://localhost:5000/api/profile/${userID}`); 

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

// Get GitHub Repos
export const getGithubRepos = username => async dispatch => {
  try {
    const res = await axios.get(`http://localhost:5000/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

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

// Add Experience 
export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const res = await axios.put('http://localhost:5000/api/profile/experience', formData, config); 
     
    dispatch({
      type: UPDATE_PROFILE, 
      payload: res.data 
    }); 
    
    dispatch(setAlert('Experience Added!', 'success')); 

    history.push('/dashboard'); // Need to use history.push() inside an action
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
}

// Add Education 
export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const res = await axios.put('http://localhost:5000/api/profile/education', formData, config); 
     
    dispatch({
      type: UPDATE_PROFILE, 
      payload: res.data 
    }); 
    
    dispatch(setAlert('Education Added!', 'success')); 

    history.push('/dashboard'); // Need to use history.push() inside an action
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
}

// Delete experience
export const deleteExperience = (id) => async dispatch => {
  try {
    const res = await axios.delete(`http://localhost:5000/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Removed', 'caution'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { 
        msg: err.response.statusText, 
        status: err.response.status 
      }
    });
  }
};

// Delete education
export const deleteEducation = (id) => async dispatch => {
  try {
    console.log('Attempting to delete education...'); 
    
    const res = await axios.delete(`http://localhost:5000/api/profile/education/${id}`);
    console.log(res)
    console.log(res.data)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });


    dispatch(setAlert('Education Removed.', 'caution'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { 
        msg: err.response.statusText, 
        status: err.response.status 
      }
    });
  }
};

// Nuclear Option 
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? Like activating the nuclear football, this CANNOT be undone!')) {
    try {
      await axios.delete('http://localhost:5000/api/profile');

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert('Your profile has been permanantly deleted', 'danger'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};