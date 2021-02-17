import React, { Fragment, useState } from 'react'; 
import PropTypes from 'prop-types'; 
import { connect } from 'react-redux'; 
import { addEducation } from '../../actions/profile'; 
import { Link, withRouter } from 'react-router-dom'; 

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  }); 

  const [toDateDisabled, toggleDisabled] = useState(false); 

  const { 
    school, 
    degree, 
    fieldofstudy, 
    from, 
    to, 
    current, 
    description 
  } = formData; 

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); 

  const onSubmit = e => {
    e.preventDefault(); 
    addEducation(formData, history);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">
       Add Education
      </h1>
      <p className="lead">
        <i className="fas fa-graduation-cap"></i> Add any education you have
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={e => onSubmit(e)}>
      <div className='form-group'>
        <small>School Attended</small>
        <input
          type='text'
          placeholder='* School'
          name='school'
          value={school}
          onChange={e => onChange(e)}
          required
        />
      </div>
        <div className='form-group'>
          <small>Degree Awarded</small>
          <input
            type='text'
            placeholder='* Degree'
            name='degree'
            value={degree}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <small>Field of Study</small>
          <input
            type='text'
            placeholder='Field of Study'
            name='fieldofstudy'
            value={fieldofstudy}
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
            Currently Attending
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
          <small>Brief Description (Optional)</small>
          <textarea
            name='description'
            cols='30'
            rows='5'
            placeholder='Education Description'
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

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired 
}

export default connect(null, { addEducation })(withRouter(AddEducation)); 
