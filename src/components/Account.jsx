import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class Account extends React.Component {
  state = {
    toDashboard: false,
    authenticated: false,
  };

  componentWillMount() {
    const { cookies } = this.props;

    if (JSON.stringify(cookies.get('sessionId')) === undefined) {
      this.setState({
        authenticated: false,
      });
    } else {
      this.setState({
        authenticated: true,
      });
    }
  }

  handleBack = (event) => {
    event.preventDefault();

    this.setState({
      toDashboard: true,
    });
  };

  handleLogout = (event) => {
    event.preventDefault();
    const { cookies } = this.props;

    (async () => {
      await fetch('http://localhost:3000/auth/logout', {
        headers: {
          "Authorization": cookies.get('sessionId'),
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }).then((response) => {
          if (response.error === undefined) {
            cookies.remove('sessionId');
            this.setState({
              authenticated: false,
            });
          } else {
            console.log(response.error);
          }
        })
        .catch(error => console.error('Error:', error));
    })();


  };

  render() {
    const { classes } = this.props;

    /**
     * Using react-router, if the correct state is detected the redirect component
     * will send the user to the dashboard.
     */
    if (this.state.toDashboard === true) {
      return <Redirect to="/dashboard" />;
    }

    /**
     * If a session ID was not detected, the user is sent to the login page.
     */
    if (this.state.authenticated === false) {
      return <Redirect to="/" />;
    }

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.handleBack}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Account
            </Typography>
            <Button color="inherit" onClick={this.handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  cookies: instanceOf(Cookies).isRequired,
};

Account = withStyles(styles)(Account); // eslint-disable-line no-class-assign
export default withCookies(Account);
