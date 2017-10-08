/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import axios from 'axios';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Redirect, Switch } from 'react-router-dom';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkTheme from './themes/dark';
import lightTheme from './themes/light';
import { cyan700, orange800, green600, blueGrey500, blue600, red600, white } from 'material-ui/styles/colors';

import CircularProgress from 'material-ui/CircularProgress';

// Component for router
import Login from './components/Login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Changes from './components/Changes';
import Categories from './components/Categories';
import Settings from './components/Settings';
import Logout from './components/Logout';

import AccountSelector from './components/accounts/AccountSelector';
import CurrencySelector from './components/currency/CurrencySelector';

import auth from './auth';
import storage from './storage';
import AccountStore from './stores/AccountStore';
import UserStore from './stores/UserStore';

import createHistory from 'history/createBrowserHistory';
const history = createHistory();

const styles = {
  toolbar: {
    background: '#D8D8D8',
  },
  title: {
    textAlign: 'left',
  },
  separator: {
    margin: '0px 8px',
  },
  iconButton: {
    width: 55,
    height: 55,
  },
  icon: {
    width: 25,
    height: 25,
  },
  hamburger: {
    color: 'white',
    width: 30,
    height: 30,
    padding: '14px 16px'
  },
  drawer: {
    paddingTop: 20,
  }
};

class Main extends Component {

  constructor(props, context) {
    super(props, context);
    this.context = context;

    let now = new Date();

    this.state = {
      loading: true,
      logged: false,
      background: blue600,
      year: now.getFullYear(),
      month: now.getMonth()+1
    };
  }

  componentWillMount() {

    if (!localStorage.getItem('server')) {
      localStorage.setItem('server', 'https://seven23.io');
    }

    axios.defaults.baseURL = localStorage.getItem('server');

    UserStore.addChangeListener(this._userUpdate);

    var component = this;
    // connect storage to indexedDB
    storage.connectIndexedDB().then(() => {
      if (auth.loggedIn() && !auth.isInitialize()) {
        auth.initialize().then(() => {
          // If after init user has no account, we redirect ot create one.
          if (AccountStore.accounts && AccountStore.accounts.length === 0) {
            this.context.router.push('/accounts');
          }
          component._changeColor(history.location);
          component.setState({
            loading: false,
            logged: true
          });
        });
      } else {
        component._changeColor(history.location);
        component.setState({
          loading: false,
          logged: false
        });
      }
    }).catch((exception) => {
      console.error(exception);
    });

    this.removeListener = history.listen(location => {
      this._changeColor(location);
    });
  }

   _changeColor = (route) => {
      if (route.pathname.startsWith('/dashboard') || route.pathname.startsWith('/logout')) {
        lightTheme.palette.primary1Color = blue600;
      } else if (route.pathname.startsWith('/transactions')) {
        lightTheme.palette.primary1Color = cyan700;
      } else if (route.pathname.startsWith('/changes')) {
        lightTheme.palette.primary1Color = orange800;
      } else if (route.pathname.startsWith('/categories')) {
        lightTheme.palette.primary1Color = green600;
      } else if (route.pathname.startsWith('/events')) {
        lightTheme.palette.primary1Color = red600;
      } else if (route.pathname.startsWith('/settings')) {
        lightTheme.palette.primary1Color = blueGrey500;
      }
      document.documentElement.style.setProperty(`--primary-color`, lightTheme.palette.primary1Color);
      // setState trigger dom rendering
      this.setState({
        background: lightTheme.palette.primary1Color
      });
   };


  componentDidMount() {
    console.log(history);
  }

  componentWillUnmount() {
    this.removeListener();
    UserStore.removeChangeListener(this._userUpdate);
  }

  _userUpdate = () => {
    if (!this.state.logged && auth.loggedIn() && auth.isInitialize()) {
      setTimeout(() => {
        history.replace('/');
      }, 450);
    }
    this.setState({
      logged: auth.loggedIn() && auth.isInitialize()
    });
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightTheme)}>
        <Router history={history}>
          <main className={this.state.logged ? 'loggedin' : 'notloggedin'}>
            <MuiThemeProvider muiTheme={getMuiTheme(darkTheme)}>
              <aside className="navigation" style={{'background': this.state.background}}>
                { !this.state.logged
                ?
                  <Route component={Login} />
                :
                  <Route component={Navigation} />
                }
              </aside>
            </MuiThemeProvider>
            { this.state.logged ?
              <div id="container">
              <Toolbar id="toolbar">
                <ToolbarGroup firstChild={true}>

                </ToolbarGroup>
                <ToolbarGroup>
                  <AccountSelector />
                  <ToolbarSeparator style={styles.separator} />
                  <CurrencySelector />
                </ToolbarGroup>
              </Toolbar>
              <div id="content">
                <Switch>
                  <Redirect exact from='/' to='/dashboard'/>
                  <Route exact path='/dashboard' component={Dashboard} />
                  <Route path='/dashboard/:year' component={Dashboard} />
                  <Redirect exact from='/transactions' to={`/transactions/${this.state.year}/${this.state.month}`} />
                  <Route path="/transactions/:year/:month" component={Transactions} />
                  <Route exact path="/categories" component={Categories} />
                  <Route path="/categories/:id" component={Categories} />
                  <Route path="/changes" component={Changes} />
                  <Route path="/settings" component={Settings} />
                  <Route path="/logout" component={Logout} />
                </Switch>
              </div>
            </div>
            : '' }
          </main>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default Main;
