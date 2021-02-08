import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 
import Spinner from '../layout/Spinner'; 
import { getProfiles } from '../../actions/profile'; 
import ProfileItem from './ProfileItem'; 
// import profile from '../../reducers/profile';

const Profiles = ({ getProfiles, profile: { profiles, loading }}) => {
  useEffect(() => {
    getProfiles();
  }, []); 

  return (
    <Fragment>
      { loading ? <Spinner/> : 
        <Fragment> 
          <h1 className="large text-primary">Profiles</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i> Connnect with other coders! 
          </p>
          <div className="profiles"> 
            { profiles.length > 0 ? profiles.map(p => { 
              return <ProfileItem key={p._id} profile={p} />
            }) : 
              <div>No Profiles Found</div>
            }
          </div>
        </Fragment> 
      }
    </Fragment>
  );
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired 
};

const mapStateToProps = state => ({
  profile: state.profile
}); 

export default connect(mapStateToProps, { getProfiles })(Profiles);