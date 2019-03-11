import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Shifts from './Shifts';
import Divider from "@material-ui/core/Divider";


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
  list: {
    width: 300,
  },
  fullList: {
    width: 'auto',
  },
});

class Dashboard extends React.Component {
  state = {
    toAccount: false,
    authenticated: false,
    drawerOpen: false
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

  handleAccountButton = (event) => {
    event.preventDefault();

    this.setState({
      toAccount: true,
    });
  };

  handleDrawer = (event) => {
    event.preventDefault();

    this.setState({
      drawerOpen: !this.state.drawerOpen,
    });
  };


  render() {
    const { classes } = this.props;

    /**
     * Using react-router, if the correct state is detected the redirect component
     * will send the user to the account page.
     */
    if (this.state.toAccount === true) {
      return <Redirect to="/account" />;
    }

    /**
     * If a session ID was not detected, the user is sent to the login page.
     */
    if (this.state.authenticated === false) {
      return <Redirect to="/" />;
    }

    const drawerContents = (
      <div className={classes.list}>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          Dashboard
        </Typography>
        <Divider />
        <Typography variant="h6" color="inherit" className={classes.grow}>
          Dashboard
        </Typography>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.handleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Dashboard
            </Typography>
            <IconButton color="inherit" onClick={this.handleAccountButton}>
              <AccountCircle/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.drawerOpen} onClose={this.handleDrawer}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.handleDrawer}
            onKeyDown={this.handleDrawer}
          >
            {drawerContents}
          </div>
        </Drawer>
        <Shifts/>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  cookies: instanceOf(Cookies).isRequired,
};

Dashboard = withStyles(styles)(Dashboard); // eslint-disable-line no-class-assign
export default withCookies(Dashboard);
