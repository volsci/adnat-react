import React from 'react';
import PropTypes, { instanceOf } from "prop-types";
import { Cookies, withCookies } from "react-cookie";
import { Redirect } from 'react-router-dom';

class Dashboard extends React.Component {
  state = {
    authenticated: false
  };

  componentWillMount() {
    const { cookies } = this.props;

    if (JSON.stringify(cookies.get('sessionId')) !== '') {
      this.setState({
        authenticated: true
      });
    } else {
      this.setState({
        authenticated: false
      });
    }
  }

  render() {
    /**
     * If a session ID was not detected, the user is sent to the login page.
     */
    if (this.state.authenticated === false) {
      return <Redirect to="/" />;
    }

    return (
      <h2>Dashboard!</h2>
    )
  }
}

Dashboard.propTypes = {
  //classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Dashboard);

