import axios from 'axios'; 
import { set } from 'mongoose';
import { setAlert } from './alert';
import {
  ADD_POST,
  DELETE_POST,
  GET_POSTS, 
  POST_ERROR, 
  UPDATE_LIKES, 
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
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
// Get Post
export const getPost = (id) => async dispatch => { 
  try {
    const res = await axios.get(`http://localhost:5000/api/posts/${id}`); 

    dispatch({ 
      type: GET_POST, 
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
    const res = await axios.put(`/api/posts/like/${id}`); // http://localhost:5000

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
    const res = await axios.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (error) {
    console.log("Error from removeLike: "); 
    console.log(error); 
    dispatch({
      type: POST_ERROR,
      payload: { msg: error, status: error.response.status } 
    });
  }
}

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }; // Config needed for post request 

  try {
    const res = await axios.post(`http://localhost:5000/api/posts/comment/${postId}`,
      formData,
      config
    );

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    });

    dispatch(setAlert('Comment Added', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await axios.delete(`http://localhost:5000/api/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    });

    dispatch(setAlert('Comment Removed', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}