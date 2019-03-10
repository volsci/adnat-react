import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField/TextField';
import Grid from '@material-ui/core/Grid/Grid';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import withStyles from '@material-ui/core/es/styles/withStyles';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
    margin: theme.spacing.unit * 3,
    maxWidth: 600,
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
    toLogIn: false,
  };

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

              this.setState({
                toLogIn: true,
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
                  />
                </CardActions>
                <CardActions disableActionSpacing>
                  <Button variant="contained" color="secondary" className={classes.forgotPassword} onClick={this.handleSignUp}>
                    Sign Up
                  </Button>
                </CardActions>
                <CardActions disableActionSpacing>
                  <Button variant="contained" color="primary" className={classes.forgotPassword} onClick={this.handleBack}>
                    Back
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.error}
          autoHideDuration={3000}
          onClose={this.handleSnackBarClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.errorMsg}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleSnackBarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Grid>
    );
  }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(SignUp);