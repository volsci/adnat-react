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
import Edit from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';

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
    margin: theme.spacing.unit,
    width: 200,
    height: 200,
  },
  card: {
    margin: theme.spacing.unit * 3,
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
    email: ''
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

        <Grid container justify="center" alignItems="center" direction="column">
          <Grid item>
            <Avatar src="https://blogtimenow.com/wp-content/uploads/2014/06/hide-facebook-profile-picture-notification.jpg" className={classes.avatar} />
          </Grid>
          <Card className={classes.card}>
            <ReactHoverObserver>
              {({ isHovering }) => (
                <CardActions disableActionSpacing className={classes.cardAction}>
                  <Typography variant="h6" color="inherit" className={classes.grow}>
                    {this.state.name}
                  </Typography>
                  <IconButton className={classes.menuButton} aria-label="Menu" >
                    { isHovering ? <Edit /> : null }
                  </IconButton>
                </CardActions>
              )}
            </ReactHoverObserver>
            <Divider variant="middle" />
            <ReactHoverObserver>
              {({ isHovering }) => (
                <CardActions disableActionSpacing className={classes.cardAction}>
                  <Typography variant="h6" color="inherit" className={classes.grow}>
                    {this.state.email}
                  </Typography>
                  <IconButton className={classes.menuButton} aria-label="Menu" >
                    { isHovering ? <Edit /> : null }
                  </IconButton>
                </CardActions>
              )}
            </ReactHoverObserver>
          </Card>
        </Grid>

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
