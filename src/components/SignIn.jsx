import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField/TextField';
import Grid from '@material-ui/core/Grid/Grid';
import Switch from '@material-ui/core/Switch/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup/FormGroup';


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
    width: '100%',
  },
  login: {
    margin: theme.spacing.unit,
    width: '100%',
    marginLeft: 'auto',
  },
  signUp: {
    width: '100%',
  },
  accountHandlers: {
    margin: theme.spacing.unit * 3,
    marginLeft: 'auto',
    width: '100%',
  },
});

class SignIn extends React.Component {
  state = {
    rememberMe: true,
  };

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;

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
                      <Button color="primary" className={classes.accountHandlers}>
                        Forgot Password
                      </Button>
                    </Grid>
                  </Grid>
                </CardActions>
                <CardActions disableActionSpacing>
                  <Button variant="contained" color="secondary" className={classes.login}>
                    Log In
                  </Button>

                </CardActions>
              </Card>
              <Button color="primary" className={classes.signUp}>
                Don't have an account yet? Sign Up
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(SignIn);
