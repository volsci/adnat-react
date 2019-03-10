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

    if (cookies.getAll().hasOwnProperty('sessionId')) {
      this.setState({
        authenticated: true
      });
    }
  }

  render() {

    if (this.state.authenticated === true) {
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

