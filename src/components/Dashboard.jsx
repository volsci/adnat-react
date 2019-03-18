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
import Save from '@material-ui/icons/Save';
import AddCircle from '@material-ui/icons/AddCircle';
import Cancel from '@material-ui/icons/Cancel';
import MenuIcon from '@material-ui/icons/Menu';
import Work from '@material-ui/icons/Work';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TextField from '@material-ui/core/TextField/TextField';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import ReactHoverObserver from 'react-hover-observer';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Shifts from './Shifts';

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
  paper: {
    margin: theme.spacing.unit,
  },
});

class Dashboard extends React.Component {
  state = {
    toAccount: false,
    authenticated: false,
    drawerOpen: false,
    createNewOrganisation: false,
    newOrganisationName: '',
    newOrganisationHourly: 0,
    currentOrganisationId: 0,
    error: false,
    errorMsg: '',
    organisations: [],
    editOrganisation: false,
    editOrganisationId: 0,
    editedOrganisationName: '',
    editedOrganisationHourly: 0,
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
    if (this.state.authenticated === true) {
      this.getCurrentOrganisationId();
      this.getOrganisations();
    }
  }

  getOrganisations() {
    const { cookies } = this.props;

    (async () => {
      await fetch('http://localhost:3000/organisations', {
        headers: {
          Authorization: cookies.get('sessionId'),
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then(res => res.json())
        .then((response) => {
          if (response.error === undefined) {
            this.setState({
              organisations: response,
            });
          } else {
            console.log(response.error);
          }
        })
        .catch(error => console.error('Error:', error));
    })();
  }

  getCurrentOrganisationId() {
    const { cookies } = this.props;

    (async () => {
      await fetch('http://localhost:3000/users/me', {
        headers: {
          Authorization: cookies.get('sessionId'),
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then(res => res.json())
        .then((response) => {
          if (response.error === undefined) {
            this.setState({
              currentOrganisationId: response.organisationId,
            });
          } else {
            console.log(response.error);
          }
        })
        .catch(error => console.error('Error:', error));
    })();
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

  handleCreateNewOrganisation = (event) => {
    event.preventDefault();

    this.setState({
      createNewOrganisation: !this.state.createNewOrganisation,
    });
  };

  handleNewOrganisationNameChange = (event) => {
    event.preventDefault();

    this.setState({
      newOrganisationName: event.target.value,
    });
  };

  handleNewOrganisationHourlyChange = (event) => {
    event.preventDefault();

    this.setState({
      newOrganisationHourly: event.target.value,
    });
  };

  handleOrganisationNameEdit = (event) => {
    event.preventDefault();

    this.setState({
      editedOrganisationName: event.target.value,
    });
  };

  handleOrganisationHourlyEdit = (event) => {
    event.preventDefault();

    this.setState({
      editedOrganisationHourly: event.target.value,
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

  handleOrganisationEditor = (event, organisation) => {
    event.preventDefault();

    this.setState({
      editOrganisation: !this.state.editOrganisation,
      editOrganisationId: organisation,
    });
  };

  handleLeaveAndJoinOrganisation = (event, organisationToJoinId) => {
    event.preventDefault();
    event.stopPropagation();

    const { cookies } = this.props;

    if (this.state.currentOrganisationId === null) {
      (async () => {
        await fetch('http://localhost:3000/organisations/join', {
          headers: {
            Authorization: cookies.get('sessionId'),
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            organisationId: organisationToJoinId,
          }),
        }).then(res => res.json())
          .then((response) => {
            this.setState({
              currentOrganisationId: response.id,
            });
            this.componentDidMount();
            this.handleDrawer(event);
            this.handleSnackBarOpen(`Joined ${response.name}`);
          })
          .catch(error => console.error('Error:', error));
      })();
    }
  };

  handleSaveNewOrganisation = (event) => {
    event.preventDefault();
    const { cookies } = this.props;

    if (this.state.newOrganisationName === '') {
      this.handleSnackBarOpen('Please provide a name');
    } else if (Number.isNaN(parseInt(this.state.newOrganisationHourly, 10)) === true) {
      this.handleSnackBarOpen('Hourly rate must be a number');
    } else if (parseInt(this.state.newOrganisationHourly, 10) < 1) {
      this.handleSnackBarOpen('Hourly rate must be greater than 0');
    } else {
      (async () => {
        await fetch('http://localhost:3000/organisations/create_join', {
          headers: {
            Authorization: cookies.get('sessionId'),
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            name: this.state.newOrganisationName,
            hourlyRate: this.state.newOrganisationHourly,
          }),
        }).then(res => res.json())
          .then((response) => {
            if (response.error === undefined) {
              this.setState({
                newOrganisationName: '',
                newOrganisationHourly: 0,
                createNewOrganisation: false,
              });
              this.componentDidMount();
            } else {
              this.handleSnackBarOpen(response.error);
            }
          })
          .catch(error => console.error('Error:', error));
      })();
    }
  };

  handleUpdateOrganisation = (event) => {
    event.preventDefault();
    const { cookies } = this.props;

    if (this.state.editedOrganisationName === '') {
      this.handleSnackBarOpen('Please provide a name');
    } else if (Number.isNaN(parseInt(this.state.editedOrganisationHourly, 10)) === true) {
      this.handleSnackBarOpen('Hourly rate must be a number');
    } else if (parseInt(this.state.editedOrganisationHourly, 10) < 1) {
      this.handleSnackBarOpen('Hourly rate must be greater than 0');
    } else {
      (async () => {
        await fetch(`http://localhost:3000/organisations/${this.state.editOrganisationId}`, {
          headers: {
            Authorization: cookies.get('sessionId'),
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify({
            name: this.state.editedOrganisationName,
            hourlyRate: this.state.editedOrganisationHourly,
          }),
        }).then((response) => {
          if (response.error === undefined) {
            this.setState({
              editedOrganisationName: '',
              editedOrganisationHourly: 0,
              editOrganisation: false,
              editOrganisationId: 0,
            });
            this.componentDidMount();
          } else {
            this.handleSnackBarOpen(response.error);
          }
        })
          .catch(error => console.error('Error:', error));
      })();
    }
  };

  render() {
    const { classes } = this.props;


    let createOrganisation;
    let listItems;

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

    if (this.state.currentOrganisationId > 0) {
      createOrganisation = <div />;
    } else if (this.state.createNewOrganisation === true) {
      createOrganisation = (
        <Paper className={classes.paper}>
          <TextField
            className={classes.input}
            id="outlined-name"
            label="Organisation Name"
            margin="normal"
            onChange={this.handleNewOrganisationNameChange}
            fullWidth
          />
          <TextField
            className={classes.input}
            id="outlined-rate"
            label="Hourly Rate"
            margin="normal"
            onChange={this.handleNewOrganisationHourlyChange}
            fullWidth
          />
          <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.handleSaveNewOrganisation}>
            <Save />
          </IconButton>
          <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.handleCreateNewOrganisation}>
            <Cancel />
          </IconButton>
        </Paper>
      );
    } else {
      createOrganisation = (
        <div>
          <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.handleCreateNewOrganisation}>
            <AddCircle />
          </IconButton>
        </div>
      );
    }

    if (this.state.currentOrganisationId > 0) {
      listItems = (
        <List>
          {
                      this.state.organisations.map(organisation => (
                        <ReactHoverObserver>
                          {({ isHovering }) => (
                            <ListItem
                              selected={organisation.id === this.state.currentOrganisationId}
                              key={organisation.id}
                            >
                              <ListItemIcon><Work /></ListItemIcon>
                              { this.state.editOrganisation && organisation.id
                              === this.state.editOrganisationId ? (
                                <div>
                                  <TextField
                                    className={classes.input}
                                    id="outlined-name"
                                    label="Organisation Name"
                                    margin="normal"
                                    onChange={this.handleOrganisationNameEdit}
                                    fullWidth
                                  />
                                  <TextField
                                    className={classes.input}
                                    id="outlined-rate"
                                    label="Hourly Rate"
                                    margin="normal"
                                    onChange={this.handleOrganisationHourlyEdit}
                                    fullWidth
                                  />
                                  <IconButton
                                    className={classes.menuButton}
                                    aria-label="Menu"
                                    onClick={this.handleUpdateOrganisation}
                                  >
                                    <Save />
                                  </IconButton>
                                  <IconButton
                                    className={classes.menuButton}
                                    aria-label="Menu"
                                    onClick={this.handleOrganisationEditor}
                                  >
                                    <Cancel />
                                  </IconButton>
                                </div>
                                ) : (
                                  <div>
                                    <ListItemText
                                      primary={organisation.name}
                                      secondary={`$${organisation.hourlyRate} p/h`}
                                    />
                                    <IconButton
                                      className={classes.menuButton}
                                      aria-label="Menu"
                                      onClick={event => this.handleOrganisationEditor(event,
                                        organisation.id)}
                                    >
                                      { isHovering ? <Edit /> : null }
                                    </IconButton>
                                    <IconButton className={classes.menuButton} aria-label="Menu">
                                      { isHovering
                                      && (this.state.currentOrganisationId === organisation.id)
                                        ? <Delete /> : null }
                                    </IconButton>
                                  </div>
                                )
                             }
                            </ListItem>
                          )}
                        </ReactHoverObserver>
                      ))
                    }
        </List>
      );
    } else {
      listItems = (
        <List>
          {
            this.state.organisations.map(organisation => (

              <ListItem
                button
                selected={organisation.id
                === this.state.currentOrganisationId}
                key={organisation.id}
                onClick={event => this.handleLeaveAndJoinOrganisation(event,
                  organisation.id)}
              >
                <ListItemIcon><Work /></ListItemIcon>
                <ListItemText primary={organisation.name} secondary={`$${organisation.hourlyRate} p/h`} />

              </ListItem>

            ))
          }
        </List>
      );
    }

    const drawerContents = (
      <div className={classes.list}>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          Organisations
        </Typography>
        <Divider />
        {listItems}
        <Divider />
        {createOrganisation}
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
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.drawerOpen} onClose={this.handleDrawer}>
          <div
            tabIndex={0}
            role="button"
            // onKeyDown={this.handleDrawer}
          >
            {drawerContents}
          </div>
        </Drawer>
        <Shifts />

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

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  cookies: instanceOf(Cookies).isRequired,
};

Dashboard = withStyles(styles)(Dashboard); // eslint-disable-line no-class-assign
export default withCookies(Dashboard);
