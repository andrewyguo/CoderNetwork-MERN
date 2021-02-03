import { REMOVE_ALERT, SET_ALERT } from '../actions/types'; 

const initialState = [
  // {
  //   id: 1, 
  //   msg: 'Log in', 
  //   alertType: 'success'
  // }
]; 

export default function(state = initialState, action) {
  const { type, payload } = action; 

  switch(type) {
    case SET_ALERT: 
      return [...state, payload]; // Adds payload to alert array 
    case REMOVE_ALERT: 
      return state.filter(alert => alert.id !== payload); // Removes payload to alert array 
    default: 
      return state; 
  }
}