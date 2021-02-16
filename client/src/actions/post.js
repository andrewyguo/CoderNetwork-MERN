import axios from 'axios'; 
import { set } from 'mongoose';
import { setAlert } from './alert';
import {
  ADD_POST,
  DELETE_POST,
  GET_POSTS, 
  POST_ERROR, 
  UPDATE_LIKES
} from './types'; 

// Get Posts 
export const getPosts = () => async dispatch => { 
  try {
    const res = await axios.get('http://localhost:5000/api/posts'); 

    dispatch({ 
      type: GET_POSTS, 
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR, 
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}

// Add Post
export const addPost = (formData) => async dispatch => { 
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const res = await axios.post(`http://localhost:5000/api/posts`, formData, config); 

    dispatch({ 
      type: ADD_POST, 
      payload: res.data
    });

    dispatch(setAlert('Post Created', 'success')); 
  } catch (error) {
    dispatch({
      type: POST_ERROR, 
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}

// Delete Post
export const deletePost = (id) => async dispatch => { 
  try {
    await axios.delete(`http://localhost:5000/api/posts/${id}`); 

    dispatch({ 
      type: DELETE_POST, 
      payload: id
    });

    dispatch(setAlert('Post Deleted', 'caution')); 
  } catch (error) {
    dispatch({
      type: POST_ERROR, 
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}

// Add like
export const addLike = id => async dispatch => {
  try {
    const res = await axios.put(`http://localhost:5000/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (error) {
    console.log("Error from addLike: "); 
    console.log(error); 
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status } // 
    });
  }
}

// Remove like
export const removeLike = id => async dispatch => {
  try {
    const res = await axios.put(`http://localhost:5000/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (error) {
    console.log("Error from removeLike: "); 
    console.log(error); 
    dispatch({
      type: POST_ERROR,
      payload: { msg: error, status: error.response.status } // .response.statusText
    });
  }
}