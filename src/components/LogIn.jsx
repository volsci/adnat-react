import React from 'react';
import PropTypes, { instanceOf } from "prop-types";
import { withCookies, Cookies } from 'react-cookie';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField/TextField';
import Grid from '@material-ui/core/Grid/Grid';
import Switch from '@material-ui/core/Switch/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup/FormGroup';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import IconButton from '@material-ui/core/IconButton/IconButton';


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
  signUp: {
    width: '100%',
  },
  accountHandlers: {
    margin: theme.spacing.unit,
    marginLeft: 'auto',
    width: '100%',
  },
});

class LogIn extends React.Component {
  state = {
    email: '',
    password: '',
    rememberMe: false,
    error: false,
    errorMsg: '',
    toSignUp: false,
    toForgotPassword: false
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

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleForgotPassword = (event) => {
    event.preventDefault();

    this.setState({
      toForgotPassword: true
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

  saveCookie = (sessionId) => {
    const { cookies } = this.props;

    if (this.state.rememberMe === true) {
      const rememberMeExpiry = new Date();
      rememberMeExpiry.setDate(rememberMeExpiry.getDate() + 7);
      cookies.set('sessionId', sessionId, { expires: rememberMeExpiry, path: '/' });
    } else {
      cookies.set('sessionId', sessionId, { path: '/' });
    }

    console.log(cookies.getAll());
  };

  handleLogin = (event) => {
    event.preventDefault();

    if (this.state.email === '' || this.state.password === '') {
      this.handleSnackBarOpen("Please enter your email address and password");
    } else if (!this.state.email.includes('@')) {
      this.handleSnackBarOpen("Please provide a valid email address");
    } else {
      (async () => {
        await fetch('http://localhost:3000/auth/forgotPassword', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          }),
        }).then(res => res.json())
          .then(response => {
            if (response.error === undefined){
              this.saveCookie(response.sessionId);
            } else {
              this.handleSnackBarOpen(response.error);
            }

          })
          .catch(error => console.error('Error:', error));
      })();
    }
  };

  handleSignUp = (event) => {
    event.preventDefault();

    this.setState({
      toSignUp: true
    });
  };

  render() {
    const { classes } = this.props;

    if (this.state.toSignUp === true){
      return <Redirect to='/signup' />
    }

    if (this.state.toForgotPassword === true){
      return <Redirect to='/forgotpass' />
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
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
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
                    autoComplete="current-password"
                    margin="normal"
                    variant="outlined"
                    value={this.state.password}
                    onChange={this.handlePasswordInput}
                  />
                </CardActions>
                <CardActions>
                  <Grid container spacing={24}>
                    <Grid item xs={6}>
                      <FormGroup row>
                        <FormControlLabel
                          className={classes.accountHandlers}
                          control={(
                            <Switch
                              checked={this.state.rememberMe}
                              onChange={this.handleChange('rememberMe')}
                              value="rememberMe"
                            />
                          )}
                          label="Remember Me"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <Button color="primary" className={classes.accountHandlers} onClick={this.handleForgotPassword}>
                        Forgot Password
                      </Button>
                    </Grid>
                  </Grid>
                </CardActions>
                <CardActions disableActionSpacing>
                  <Button variant="contained" color="secondary" className={classes.forgotPassword} onClick={this.handleLogin}>
                    Log In
                  </Button>

                </CardActions>
              </Card>
              <Button color="primary" className={classes.signUp} onClick={this.handleSignUp}>
                Don't have an account yet? Sign Up
              </Button>
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
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />


      </Grid>
    );
  }
}

LogIn.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  cookies: instanceOf(Cookies).isRequired
};

LogIn = withStyles(styles)(LogIn);
export default withCookies(LogIn);
