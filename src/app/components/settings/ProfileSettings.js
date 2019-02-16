/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';

import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import PasswordForm from '../settings/profile/PasswordForm';
import EmailForm from '../settings/profile/EmailForm';

class ProfileSettings extends Component {
  constructor(props, context) {
    super(props, context);
    this.onModal = props.onModal;
  }

  _editPassword = () => {
    this.onModal(
      <PasswordForm
        onSubmit={() => this.onModal()}
        onClose={() => this.onModal()}
      />,
    );
  };

  _editMail = () => {
    this.onModal(
      <EmailForm
        onSubmit={() => this.onModal()}
        onClose={() => this.onModal()}
      />,
    );
  };

  render() {
    const { profile } = this.props;
    return (
      <div className="grid">
        <div className="small">
          <Card square>
            <CardHeader title="Profile" subtitle="Edit your user profile" />
            <List>
              <Divider />
              <ListItem>
                <ListItemText primary="Username" secondary={profile.username}/>
              </ListItem>
              <ListItem>
                <ListItemText primary="Firstname" secondary={profile.first_name}/>
              </ListItem>
              <ListItem
                button
                onClick={this._editMail}
              >
                <ListItemText primary="Email" secondary={profile.email}/>
                <KeyboardArrowRight />
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={this._editPassword}
              >
                <ListItemText primary="Change password" secondary="Do not neglect security"/>
                <KeyboardArrowRight />
              </ListItem>
            </List>
          </Card>
        </div>
      </div>
    );
  }
}

ProfileSettings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    profile: state.user.profile
  };
};

export default connect(mapStateToProps)(ProfileSettings);