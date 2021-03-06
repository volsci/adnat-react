import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField/TextField';
import Grid from '@material-ui/core/Grid/Grid';
import PopUp from './PopUp';
import adnat from '../../public/adnat.png';

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
  adnat: {
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
  },
});

/**
 * The ForgotPassword component allows the user to enter their email. Future
 * functionality will see an email sent to the user with a reset password link.
 */
class ForgotPassword extends React.Component {
  state = {
    email: '',
    error: false,
    errorMsg: '',
    toLogIn: false,
    authenticated: false,

  };

  componentDidMount() {
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

  handleEmailInput = (event) => {
    this.setState({
      email: event.target.value,
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
   * The input is validated and discarded if it does not pass some basic checks.
   * Valid input would result in an email being sent to the specified address,
   * however this functionality is currently unavailable and there is just a pop
   * up to acknowledge successful input.
   */
  handleEmailPassword = (event) => {
    event.preventDefault();

    if (this.validateForgotPassword(this.state.email) === true) {
      this.setState({
        email: '',
      });
      this.handleSnackBarOpen('Email sent... (functionality not currently available)');
    }
  };

  handleBack = (event) => {
    event.preventDefault();

    this.setState({
      toLogIn: true,
    });
  };

  /**
   * Check if the field is empty, and check if the email is valid.
   */
  validateForgotPassword(email) {
    if (email === '') {
      this.handleSnackBarOpen('Please enter your email address');
      return false;
    } if (!email.includes('@')) {
      this.handleSnackBarOpen('Please provide a valid email address');
      return false;
    }
    return true;
  }

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
      <div className={classes.adnat}>
        <img src={adnat} alt="" />
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid
              container
              spacing={8}
              className={classes.demo}
              alignItems="center"
              justify="center"
              direction="column"
            >
              <Grid item>
                <Card className={classes.card}>
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
                    />
                  </CardActions>
                  <CardActions disableActionSpacing>
                    <Button variant="contained" color="secondary" className={classes.forgotPassword} onClick={this.handleEmailPassword}>
                    Send Me A Reset Password Link
                    </Button>
                  </CardActions>
                  <CardActions disableActionSpacing>
                    <Button variant="contained" className={classes.forgotPassword} onClick={this.handleBack}>
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
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  cookies: instanceOf(Cookies).isRequired,
};

ForgotPassword = withStyles(styles)(ForgotPassword); // eslint-disable-line no-class-assign
export default withCookies(ForgotPassword);
