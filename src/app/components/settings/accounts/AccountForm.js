/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
 import React, {Component} from 'react';
import PropTypes from 'prop-types';
 import FlatButton from 'material-ui/FlatButton';
 import TextField from 'material-ui/TextField';

import LinearProgress from 'material-ui/LinearProgress';

 import {green500, red500} from 'material-ui/styles/colors';

 import Dialog from 'material-ui/Dialog';

 import CurrencyStore from '../../../stores/CurrencyStore';
 import AccountStore from '../../../stores/AccountStore';
 import AccountActions from '../../../actions/AccountActions';

 const styles = {
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 0'
  }
 };

 class AccountForm extends Component {

   constructor(props, context) {
     super(props, context);
      // Set default values
     this.state = {
       account: props.account,
       name: props.account ? props.account.name : '',
       onSubmit: props.onSubmit,
       onClose: props.onClose,
       loading: false,
       error: {}, // error messages in form from WS
     };
   }

   handleNameChange = (event) => {
     this.setState({
       name: event.target.value,
     });
   };

   handleSubmit = () => {
     this.state.onSubmit();
   };

   handleCloseForm = () => {
     this.state.onClose();
   };

   save = (e) => {

     let component = this;

     component.setState({
       error: {},
       loading: true,
     });

     let account = {
       id: this.state.account && this.state.account.id ? this.state.account.id : '',
       name: this.state.name,
       currency: '',
     };

     if (this.state.account && this.state.account.id) {
      account.currency = this.state.account.currency;
     } else {
      account.currency = CurrencyStore.getSelectedCurrency();
     }

     AccountStore.onceChangeListener((args) => {
       if (args && args.error) {
         component.setState({
           error: args,
           loading: false,
         });
       } else {
         this.handleSubmit();
       }
     });

     if (this.state.account && this.state.account.id) {
      AccountActions.update(account);
     } else {
      AccountActions.create(account);
     }

     if (e) {
       e.preventDefault();
     }
   };

   componentWillReceiveProps(nextProps) {
     this.setState({
       account: nextProps.account,
       name: nextProps.account ? nextProps.account.name : '',
       onSubmit: nextProps.onSubmit,
       onClose: nextProps.onClose,
       loading: false,
       error: {}, // error messages in form from WS
     });
   }

   render() {
     return (
      <div>
        {
          this.state.loading ?
          <LinearProgress mode="indeterminate" />
          : ''
        }
        <div style={{padding: '16px 28px 8px 28px'}}>
          <form onSubmit={this.save}>
            <TextField
              floatingLabelText="Name"
              disabled={this.state.loading}
              onChange={this.handleNameChange}
              value={this.state.name}
              style={{width: '100%'}}
              errorText={this.state.error.name}
            />
            <div style={styles.actions}>
              <FlatButton
                label="Cancel"
                onTouchTap={this.handleCloseForm}
              />
               <FlatButton
                label="Submit"
                primary={true}
                disabled={this.state.loading}
                onTouchTap={this.save}
              />
            </div>
          </form>
        </div>
      </div>
     );
  }
}

 export default AccountForm;