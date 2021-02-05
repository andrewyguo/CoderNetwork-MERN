import React, { Fragment, useState } from 'react'; 
import PropTypes from 'prop-types'; 
import { connect } from 'react-redux'; 
import { addExperience } from '../../actions/profile'; 
import { Link, withRouter } from 'react-router-dom'; 

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  }); 

  const [toDateDisabled, toggleDisabled] = useState(false); 

  const { 
    company, 
    title, 
    location, 
    from, 
    to, 
    current, 
    description 
  } = formData; 

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); 

  const onSubmit = e => {
    e.preventDefault(); 
    addExperience(formData, history);
    console.log('Experience added.'); 
  };

  return (
    <Fragment>
      <h1 className="large text-primary">
       Add An Experience
      </h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
      <div className='form-group'>
        <small>Job Title</small>
        <input
          type='text'
          placeholder='* Job Title'
          name='title'
          value={title}
          onChange={e => onChange(e)}
          required
        />
      </div>
      <div className='form-group'>
        <small>Company</small>
        <input
          type='text'
          placeholder='* Company'
          name='company'
          value={company}
          onChange={e => onChange(e)}
          required
        />
      </div>
      <div className='form-group'>
        <small>Location</small>
        <input
          type='text'
          placeholder='Location'
          name='location'
          value={location}
          onChange={e => onChange(e)}
        />
      </div>
      <div className='form-group'>
        <h4>From Date</h4>
        <input
          type='date'
          name='from'
          value={from}
          onChange={e => onChange(e)}
        />
      </div>
      <div className='form-group'>
        <p>
          <input
            type='checkbox'
            name='current'
            checked={current}
            value={current}
            onChange={() => { // Toggle 'to' date on current 
              setFormData({ ...formData, current: !current });
              toggleDisabled(!toDateDisabled);
            }}
          />{' '}
          Current Job
        </p>
      </div>
      { !toDateDisabled && 
        <Fragment>
          <div className='form-group'>
            <h4>To Date</h4>
            <input
              type='date'
              name='to'
              value={to}
              onChange={e => onChange(e)}
              // disabled={toDateDisabled ? 'disabled' : ''}
            />
          </div>
        </Fragment> 
      }
      <div className='form-group'>
        <small>Brief Description (Optional) </small>
        <textarea
          name='description'
          cols='30'
          rows='5'
          placeholder='Job Description'
          value={description}
          onChange={e => onChange(e)}
        />
      </div>
      <input type="submit" className="btn btn-primary my-1" />
      <Link className='btn btn-light my-1' to='/dashboard'>Go Back</Link>
      </form>
    </Fragment>
  );
}

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired 
}

export default connect(null, { addExperience })(withRouter(AddExperience)); 
