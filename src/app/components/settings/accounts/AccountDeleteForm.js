/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
 import React, {Component} from 'react';
import PropTypes from 'prop-types';
 import FlatButton from 'material-ui/FlatButton';

 import CircularProgress from 'material-ui/CircularProgress';

 import {green500, red500} from 'material-ui/styles/colors';

 import AccountStore from '../../../stores/AccountStore';
 import AccountActions from '../../../actions/AccountActions';

const styles = {
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 0'
  }
 };

 class AccountDeleteForm extends Component {

   constructor(props, context) {
     super(props, context);
    // Set default values
     this.state = {
       account: props.account,
       onSubmit: props.onSubmit,
       onClose: props.onClose,
       loading: false,
       error: {}, // error messages in form from WS
     };

   }

   handleCloseForm = () => {
     this.state.onClose();
   };

   handleSubmit = () => {
     this.state.onSubmit();
   };

   delete = (e) => {

    // Logout and redirect on login page
     AccountStore.onceChangeListener((args) => {
        this.handleSubmit();
     });
     AccountActions.delete(this.state.account.id);

     if (e) {
       e.preventDefault();
     }
   };

   componentWillReceiveProps(nextProps) {
     this.setState({
       account: nextProps.account,
       onSubmit: nextProps.onSubmit,
       onClose: nextProps.onClose,
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
          <p>You are about to delete your account. All informations will be permanently lost.</p>
        </div>

        <div style={styles.actions}>
          <FlatButton
            label="Cancel"
            onTouchTap={this.handleCloseForm}
          />
           <FlatButton
            label="Delete this account"
            primary={true}
            onTouchTap={this.delete}
          />
        </div>

      </div>
     );
   }
}

 export default AccountDeleteForm;