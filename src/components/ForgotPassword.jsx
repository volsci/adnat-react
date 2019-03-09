import React from 'react';
import PropTypes from "prop-types";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField/TextField';
import Grid from '@material-ui/core/Grid/Grid';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import withStyles from "@material-ui/core/es/styles/withStyles";
import { Redirect } from "react-router-dom";


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

class ForgotPassword extends React.Component {
  state = {
    email: '',
    error: false,
    errorMsg: '',
    toLogIn: false
  };

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

  handleEmailPassword = (event) => {
    event.preventDefault();

    if (this.state.email === '') {
      this.handleSnackBarOpen("Please enter your email address");
    } else if (!this.state.email.includes('@')) {
      this.handleSnackBarOpen("Please provide a valid email address");
    } else {
      this.setState({
        email: '',
      });
      this.handleSnackBarOpen("Email sent... (functionality not currently available)");
    }
  };

  handleBack = (event) => {
    event.preventDefault();

    this.setState({
      toLogIn: true
    });
  };

  render() {
    const { classes } = this.props;

    if (this.state.toLogIn === true){
      return <Redirect to='/' />
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

ForgotPassword.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(ForgotPassword);
