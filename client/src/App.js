import './App.css';
import React, { Fragment, useEffect } from 'react'; 
// Components
import Navbar from './components/layout/Navbar'; 
import Landing from './components/layout/Landing'; 

import Routes from './components/routing/Routes';

// Redux 
import { Provider } from 'react-redux'; 
import store from './store'; 
import { loadUser } from './actions/auth'; 
import setAuthToken from './utils/setAuthToken'; 

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; 

if(localStorage.token) {
  setAuthToken(localStorage.token); 
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser()); 
  }, []); // [] to run effect only once 

  return (
    <Provider store={store}> 
      <Router> 
        <Fragment>
          <Navbar /> 
          <Switch>
            <Route exact path="/" component={ Landing } /> 
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
