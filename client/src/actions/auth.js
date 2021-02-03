import axios from 'axios'; 
import { setAlert } from './alert';
import { REGISTER_SUCCESS, REGISTER_FAIL } from './types'; 

// Register User 
export const register = ({ name, email, password }) => async dispatch => { 
  const config = {
    headers: { 
      'Content-Type': 'application/json' 
    }
  }
  const body = JSON.stringify({ name, email, password }); 

  try {
    // axios.defaults.baseURL = 'http://localhost:3000'; // Set to 3000 so axios will not go to App.js base URL to make API Requests 

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