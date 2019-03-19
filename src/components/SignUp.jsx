import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField/TextField';
import Grid from '@material-ui/core/Grid/Grid';
import withStyles from '@material-ui/core/es/styles/withStyles';
import PopUp from './PopUp';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
    margin: theme.spacing.unit * 3,
    width: 350,
    height: '100%',
  },
  control: {
    padding: theme.spacing.unit * 3,
  },
  demo: {
    height: 700,
  },
  input: {
    margin: theme.spacing.unit,
    width: '100%',
  },
  forgotPassword: {
    margin: theme.spacing.unit,
    width: '100%',
    marginLeft: 'auto',
  },
  accountHandlers: {
    margin: theme.spacing.unit,
    marginLeft: 'auto',
    width: '100%',
  },
});

/**
 * The SignUp component allows the user to create a new account, which is written
 * to the database after validation. After they create an account, they are
 * redirected back to the login page.
 */
class SignUp extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    error: false,
    errorMsg: '',
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

  handleNameInput = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  handleEmailInput = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handlePasswordInput = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handlePasswordConfirmationInput = (event) => {
    this.setState({
      passwordConfirmation: event.target.value,
    });
  };

  handleSnackBarOpen = (errorMsg) => {
    this.setState({
      error: true,
      errorMsg,
    });
  };

  handleSnackBarClose = () => {
    this.setState({
      error: false,
      errorMsg: '',
    });
  };

  /**
   * When a user is successfully authenticated, they receive a session ID. This
   * session ID is saved as a cookie, using react-cookie.
   */
  saveCookie = (sessionId) => {
    const { cookies } = this.props;
    cookies.set('sessionId', sessionId, { path: '/' });
  };

  /**
   * The input is validated and discarded if it does not pass some basic checks.
   * Valid input is composed into a POST request sent to the db, which will
   * create a new user entry.
   */
  handleSignUp = (event) => {
    event.preventDefault();

    if (this.state.name === ''
      || this.state.email === ''
      || this.state.password === ''
      || this.state.passwordConfirmation === '') {
      this.handleSnackBarOpen('Please provide all of the required details');
    } else if (!this.state.email.includes('@')) {
      this.handleSnackBarOpen('Please provide a valid email address');
    } else if (this.state.password.length < 6) {
      this.handleSnackBarOpen('Please enter a password with six characters or more');
    } else {
      (async () => {
        await fetch('http://localhost:3000/auth/signUp', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            passwordConfirmation: this.state.passwordConfirmation,
          }),
        }).then(res => res.json())
          .then((response) => {
            if (response.error === undefined) {
              this.handleSnackBarOpen('Success! Account created, please log in with your provided details');
              this.saveCookie(response.sessionId);

              this.setState({
                authenticated: true,
              });
            } else {
              this.handleSnackBarOpen(response.error);
            }
          })
          .catch(error => console.error('Error:', error));
      })();
    }
  };

  handleBack = (event) => {
    event.preventDefault();

    this.setState({
      toLogIn: true,
    });
  };

  render() {
    const { classes } = this.props;

    /**
     * Using react-router, if the correct state is detected the redirect component
     * will return the user to the log in page.
     */
    if (this.state.toLogIn === true) {
      return <Redirect to="/" />;
    }

    /**
     * If a session ID is detected, the user is sent to the dashboard.
     */
    if (this.state.authenticated === true) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={8}
            className={classes.demo}
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <Card className={classes.card}>
                <CardActions>
                  <TextField
                    className={classes.input}
                    id="outlined-name"
                    label="Name"
                    margin="normal"
                    variant="outlined"
                    value={this.state.name}
                    onChange={this.handleNameInput}
                    fullWidth
                  />
                </CardActions>
                <CardActions>
                  <TextField
                    className={classes.input}
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    name="email"
                    margin="normal"
                    variant="outlined"
                    value={this.state.email}
                    onChange={this.handleEmailInput}
                    fullWidth
                  />
                </CardActions>
                <CardActions>
                  <TextField
                    className={classes.input}
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    value={this.state.password}
                    onChange={this.handlePasswordInput}
                    fullWidth
                  />
                </CardActions>
                <CardActions>
                  <TextField
                    className={classes.input}
                    id="outlined-passwordConfirmation-input"
                    label="Confirm Password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    value={this.state.passwordConfirmation}
                    onChange={this.handlePasswordConfirmationInput}
                    fullWidth
                  />
                </CardActions>
                <CardActions disableActionSpacing>
                  <Button variant="contained" color="secondary" className={classes.forgotPassword} fullWidth onClick={this.handleSignUp}>
                    Sign Up
                  </Button>
                </CardActions>
                <CardActions disableActionSpacing>
                  <Button variant="contained" className={classes.forgotPassword} fullWidth onClick={this.handleBack}>
                    Back
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <PopUp
          error={this.state.error}
          errorMsg={this.state.errorMsg}
          handleSnackBarClose={this.handleSnackBarClose.bind(this)}
        />
      </Grid>
    );
  }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  cookies: instanceOf(Cookies).isRequired,
};

SignUp = withStyles(styles)(SignUp); // eslint-disable-line no-class-assign
export default withCookies(SignUp);
