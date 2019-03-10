import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import ReactHoverObserver from 'react-hover-observer'
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Save from '@material-ui/icons/Save';
import Cancel from '@material-ui/icons/Cancel';
import Edit from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField/TextField';
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import CloseIcon from "@material-ui/core/SvgIcon/SvgIcon";

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
  avatar: {
    marginTop: theme.spacing.unit * 10,
    margin: theme.spacing.unit * 2,
    width: 200,
    height: 200,
  },
  card: {
    margin: theme.spacing.unit * 2,
    maxWidth: 400,
    width: '100%',
    height: '100%',
  },
  cardAction: {
    margin: theme.spacing.unit,
    maxWidth: 400,
    width: '100%',
    height: 50,
  }
});

class Account extends React.Component {
  state = {
    toDashboard: false,
    authenticated: false,
    name: '',
    email: '',
    editName: '',
    editEmail: '',
    editedName: '',
    editedEmail: '',
    error: false,
    errorMsg: ''
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

  componentDidMount() {
    const { cookies } = this.props;

    if (this.state.authenticated === true) {
      (async () => {
        await fetch('http://localhost:3000/users/me', {
          headers: {
            "Authorization": cookies.get('sessionId'),
            'Content-Type': 'application/json',
          },
          method: 'GET',
        }).then(res => res.json())
          .then((response) => {
          if (response.error === undefined) {
            this.setState({
              name: response.name,
              email: response.email
            });
          } else {
            console.log(response.error);
          }
        })
          .catch(error => console.error('Error:', error));
      })();
    }
  }

  handleBack = (event) => {
    event.preventDefault();

    this.setState({
      toDashboard: true
    });
  };

  handleEditName = (event) => {
    event.preventDefault();

    this.setState({
      editedName: this.state.name,
      editName: !this.state.editName
    })
  };

  handleNameChange = (event) => {
    event.preventDefault();

    this.setState({
      editedName: event.target.value,
    });
  };

  handleEditEmail = (event) => {
    event.preventDefault();

    this.setState({
      editedEmail: this.state.email,
      editEmail: !this.state.editEmail
    })
  };

  handleEmailChange = (event) => {
    event.preventDefault();

    this.setState({
      editedEmail: event.target.value,
    });
  };

  handleUpdateName = (event) => {
    event.preventDefault();
    const { cookies } = this.props;

    if (this.state.editedName === '') {
      this.handleSnackBarOpen('Please provide a name');
    } else {
      (async () => {
        await fetch('http://localhost:3000/users/me', {
          headers: {
            "Authorization": cookies.get('sessionId'),
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify({
            name: this.state.editedName,
          }),
        }).then(res => res.json())
          .then((response) => {
            if (response.error === undefined) {
              this.setState({
                name: this.state.editedName,
                editName: false
              });
            } else {
              console.log(response.error);
            }
          })
          .catch(error => console.error('Error:', error));
      })();
    }
  };

  handleUpdateEmail = (event) => {
    event.preventDefault();
    const { cookies } = this.props;

    if (this.state.editedEmail === '') {
      this.handleSnackBarOpen('Please enter your email address');
    } else if (!this.state.editedEmail.includes('@')) {
      this.handleSnackBarOpen('Please provide a valid email address');
    } else {
      (async () => {
        await fetch('http://localhost:3000/users/me', {
          headers: {
            "Authorization": cookies.get('sessionId'),
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify({
            email: this.state.editedEmail,
          }),
        }).then(res => res.json())
          .then((response) => {
            if (response.error === undefined) {
              this.setState({
                email: this.state.editedEmail,
                editEmail: false
              });
            } else {
              console.log(response.error);
            }
          })
          .catch(error => console.error('Error:', error));
      })();
    }
  };

  handleEditEmail = (event) => {
    event.preventDefault();

    this.setState({
      editEmail: !this.state.editEmail
    })
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

  render() {
    const { classes } = this.props;

    let nameField;
    let emailField;

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

    if (this.state.editName === true) {
      nameField =   <CardActions disableActionSpacing className={classes.cardAction}>
                      <TextField
                        id="standard-name"
                        className={classes.grow}
                        value={this.state.editedName}
                        onChange={this.handleNameChange}
                        margin="normal"
                      />
                      <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.handleUpdateName}>
                        <Save />
                      </IconButton>
                      <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.handleEditName}>
                        <Cancel />
                      </IconButton>
                    </CardActions>
    } else {
      nameField = <ReactHoverObserver>
                    {({ isHovering }) => (
                      <CardActions disableActionSpacing className={classes.cardAction}>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                          {this.state.name}
                        </Typography>
                        <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.handleEditName}>
                          { isHovering ? <Edit /> : null }
                        </IconButton>
                      </CardActions>
                    )}
                  </ReactHoverObserver>
    }

    if (this.state.editEmail === true) {
      emailField =   <CardActions disableActionSpacing className={classes.cardAction}>
                      <TextField
                        id="standard-email"
                        className={classes.grow}
                        value={this.state.editedEmail}
                        onChange={this.handleEmailChange}
                        margin="normal"
                      />
                      <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.handleUpdateEmail}>
                        <Save />
                      </IconButton>
                      <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.handleEditEmail}>
                        <Cancel />
                      </IconButton>
                    </CardActions>
    } else {
      emailField = <ReactHoverObserver>
                    {({ isHovering }) => (
                      <CardActions disableActionSpacing className={classes.cardAction}>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                          {this.state.email}
                        </Typography>
                        <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.handleEditEmail}>
                          { isHovering ? <Edit /> : null }
                        </IconButton>
                      </CardActions>
                    )}
                  </ReactHoverObserver>
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

        <Grid container justify="center" alignItems="center" direction="column">
          <Grid item>
            <Avatar src="https://blogtimenow.com/wp-content/uploads/2014/06/hide-facebook-profile-picture-notification.jpg" className={classes.avatar} />
          </Grid>
          <Card className={classes.card}>
            {nameField}
            <Divider variant="middle" />
            {emailField}
          </Card>
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
