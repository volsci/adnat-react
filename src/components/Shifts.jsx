import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Cookies, withCookies } from 'react-cookie';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button/Button';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Save from '@material-ui/icons/Save';
import Delete from '@material-ui/icons/Delete';
import Cancel from '@material-ui/icons/Cancel';
import moment from 'moment/src/moment';
import CalendarToday from '@material-ui/icons/CalendarToday';
import Grid from '@material-ui/core/Grid';
import PopUp from './PopUp';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  textField: {
    flex: 1,
    width: 200,
  },
  tableRow: {
    height: 60,
  },
  shiftEdit: {
    flex: 1,
  },
  text: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: theme.spacing.unit * 2,
    maxWidth: 400,
    width: '100%',
    height: '100%',
  },
  icon: {
    marginTop: theme.spacing.unit * 10,
    margin: theme.spacing.unit * 2,
    width: 200,
    height: 200,
  },
  exit: {
    marginRight: theme.spacing.unit,
  },
});

class Shifts extends React.Component {
  state = {
    shifts: [],
    currentUserId: 0,
    currentOrganisationId: 0,
    currentOrganisationHourly: 0,
    currentOrganisationUsers: [],
    selectedUser: '',
    selectedUserId: 0,
    selectedStartDate: '',
    selectedFinishDate: '',
    selectedBreakLength: 0,
    selectedShift: false,
    selectedShiftId: 0,
    selectedShiftStartDate: '',
    selectedShiftFinishDate: '',
    selectedShiftBreakLength: 0,
    error: false,
    errorMsg: '',
  };

  componentDidMount() {
    this.getCurrentOrganisationUsers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUserId !== this.props.currentUserId) {
      this.setState({
        currentUserId: nextProps.currentUserId,
      });
    }

    if (nextProps.currentOrganisationId !== this.props.currentOrganisationId) {
      this.setState({
        currentOrganisationId: nextProps.currentOrganisationId,
      });
    }

    if (nextProps.organisations !== this.props.organisations) {
      this.getCurrentOrganisationDetails(nextProps.organisations);
      this.getShifts();
    }
  }

  getCurrentOrganisationUsers() {
    const { cookies } = this.props;

    (async () => {
      await fetch('http://localhost:3000/users', {
        headers: {
          Authorization: cookies.get('sessionId'),
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then(res => res.json())
        .then((response) => {
          if (response.error === undefined) {
            for (let i = 0; i < response.length; i += 1) {
              this.state.currentOrganisationUsers.push(response[i]);
            }
          }
        })
        .catch(error => console.error(`Error:${error}`));
    })();
  }

  getCurrentOrganisationDetails(organisations) {
    for (let i = 0; i < organisations.length; i += 1) {
      if (organisations[i].id === this.state.currentOrganisationId) {
        this.setState({
          currentOrganisationHourly: organisations[i].hourlyRate,
          currentOrganisationName: organisations[i].name,
        });
      }
    }
  }

  getShifts() {
    const { cookies } = this.props;

    (async () => {
      await fetch('http://localhost:3000/shifts', {
        headers: {
          Authorization: cookies.get('sessionId'),
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then(res => res.json())
        .then((response) => {
          if (response.error === undefined) {
            const tempShift = response;
            for (let i = 0; i < tempShift.length; i += 1) {
              this.matchNames(tempShift[i]);
              this.calculateTimeAndPay(tempShift[i]);
            }
            this.setState({
              shifts: tempShift,
            });
          } else {
            console.log(response.error);
          }
        })
        .catch(error => console.error('Error:', error));
    })();
  }

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

  handleCreateNewShift = (event) => {
    event.preventDefault();

    const { cookies } = this.props;

    const startFormat = moment(this.state.selectedStartDate).format('llll');
    const start = moment(startFormat);
    const finishFormat = moment(this.state.selectedFinishDate).format('llll');
    const finish = moment(finishFormat);
    const breakLength = parseInt(this.state.selectedBreakLength, 10);

    if (this.state.selectedUserId === 0) {
      this.handleSnackBarOpen('Please select the employee who worked this shift.');
    } else if (this.validateNewShift(start, finish, breakLength) === true) {
      (async () => {
        await fetch('http://localhost:3000/shifts', {
          headers: {
            Authorization: cookies.get('sessionId'),
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            userId: this.state.selectedUserId,
            start: start._i,
            finish: finish._i,
            breakLength: this.state.selectedBreakLength,
          }),
        }).then(() => {
          this.setState({
            selectedStartDate: '',
            selectedFinishDate: '',
            selectedBreakLength: '',
          });
          this.getShifts();
        }).catch(error => console.error('Error:', error));
      })();
    }
  };

  handleUpdateShift = (event, shift) => {
    event.preventDefault();

    const { cookies } = this.props;

    const startFormat = moment(this.state.selectedShiftStartDate).format('llll');
    const start = moment(startFormat);
    const finishFormat = moment(this.state.selectedShiftFinishDate).format('llll');
    const finish = moment(finishFormat);
    const breakLength = parseInt(this.state.selectedShiftBreakLength, 10);

    if (this.validateNewShift(start, finish, breakLength) === true) {
      (async () => {
        await fetch(`http://localhost:3000/shifts/${shift}`, {
          headers: {
            Authorization: cookies.get('sessionId'),
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify({
            start: start._i,
            finish: finish._i,
            breakLength,
          }),
        }).then(() => {
          this.setState({
            selectedShift: false,
            selectedShiftId: 0,
          });
          this.getShifts();
        }).catch(error => console.error('Error:', error));
      })();
    }
  };

  handleDeleteShift = (event, shift) => {
    event.preventDefault();

    const { cookies } = this.props;

    (async () => {
      await fetch(`http://localhost:3000/shifts/${shift}`, {
        headers: {
          Authorization: cookies.get('sessionId'),
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }).then(() => {
        this.setState({
          selectedShift: false,
          selectedShiftId: 0,
        });
        this.getShifts();
      }).catch(error => console.error('Error:', error));
    })();
  };

  handleDeleteShiftsOnLeave = (event) => {
    event.preventDefault();

    const { cookies } = this.props;

    const currentUserShifts = [];
    this.matchCurrentUserShifts(currentUserShifts);

    for (let i = 0; i < currentUserShifts.length; i += 1) {
      (async () => {
        await fetch(`http://localhost:3000/shifts/${currentUserShifts[i]}`, {
          headers: {
            Authorization: cookies.get('sessionId'),
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        }).then(() => {
        }).catch(error => console.error('Error:', error));
      })();
    }

    (async () => {
      await fetch('http://localhost:3000/organisations/leave', {
        headers: {
          Authorization: cookies.get('sessionId'),
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }).then(() => {
        this.props.leaveOrganisation();
      }).catch(error => console.error('Error:', error));
    })();
  };

  handleSelectUser = (event, child) => {
    event.preventDefault();

    this.setState({
      selectedUser: event.target.value,
      selectedUserId: child.props.id,
    });
  };

  handleSelectStartDate = (event) => {
    event.preventDefault();

    this.setState({
      selectedStartDate: event.target.value,
    });
  };

  handleSelectFinishDate = (event) => {
    event.preventDefault();

    this.setState({
      selectedFinishDate: event.target.value,
    });
  };

  handleSelectBreakLength = (event) => {
    event.preventDefault();

    this.setState({
      selectedBreakLength: event.target.value,
    });
  };

  handleSelectShiftStartDate = (event) => {
    event.preventDefault();

    this.setState({
      selectedShiftStartDate: event.target.value,
    });
  };

  handleSelectShiftFinishDate = (event) => {
    event.preventDefault();

    this.setState({
      selectedShiftFinishDate: event.target.value,
    });
  };

  handleSelectShiftBreakLength = (event) => {
    event.preventDefault();

    this.setState({
      selectedShiftBreakLength: event.target.value,
    });
  };

  handleClickShift = (event, shift) => {
    event.preventDefault();

    this.setState({
      selectedShift: true,
      selectedShiftId: shift,
    });
  };

  handleCancelShiftEdit = (event) => {
    event.preventDefault();

    this.setState({
      selectedShift: false,
      selectedShiftId: 0,
    });
  };

  validateNewShift(start, finish, breakLength) {
    if (start._i === 'Invalid date' || finish._i === 'Invalid date') {
      this.handleSnackBarOpen('Please enter valid shift start and finish times.');
      return false;
    } if (finish.diff(start, 'minutes') < 0) {
      this.handleSnackBarOpen('The shift ends before it starts. Please enter valid shift start and finish times.');
      return false;
    } if (finish.diff(start, 'minutes') < breakLength) {
      this.handleSnackBarOpen('Please enter a valid break length.');
      return false;
    } if (breakLength < 0) {
      this.handleSnackBarOpen('Please enter a valid break length.');
      return false;
    }
    return true;
  }

  matchNames(shift) {
    for (let i = 0; i < this.state.currentOrganisationUsers.length; i += 1) {
      if (shift.userId === this.state.currentOrganisationUsers[i].id) {
        shift.name = this.state.currentOrganisationUsers[i].name;
      }
    }
  }

  matchCurrentUserShifts(currentUserShifts) {
    for (let i = 0; i < this.state.shifts.length; i += 1) {
      if (this.state.shifts[i].userId === this.state.currentUserId) {
        currentUserShifts.push(this.state.shifts[i].id);
      }
    }
  }

  calculateTimeAndPay(shift) {
    const startFormat = moment(shift.start).format('llll');
    const finishFormat = moment(shift.finish).format('llll');

    const start = moment(startFormat);
    const finish = moment(finishFormat);

    const breakLength = parseInt(shift.breakLength, 10);

    const totalMinutes = finish.diff(start, 'minutes') - breakLength;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    shift.timeWorked = (`${hours} hours, ${minutes} minutes`);

    const payThresholds = Math.floor(totalMinutes / 15);
    shift.pay = payThresholds * (this.state.currentOrganisationHourly / 4);
  }

  render() {
    const { classes } = this.props;

    let shiftTable;

    const userPicker = (
      <FormControl fullWidth className={classes.textField}>
        <Select
          value={this.state.selectedUser}
          onChange={this.handleSelectUser}
          id="employee-simple"
        >
          {this.state.currentOrganisationUsers.map(user => (
            <MenuItem
              id={user.id}
              key={user.id}
              value={user.name}
            >
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );

    const startDatePicker = (
      <form className={classes.container} noValidate>
        <TextField
          id="datetime"
          type="datetime-local"
          fullWidth
          value={this.state.selectedStartDate}
          onChange={this.handleSelectStartDate}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    );

    const finishDatePicker = (
      <form className={classes.container} noValidate>
        <TextField
          fullWidth
          id="datetime-local"
          type="datetime-local"
          value={this.state.selectedFinishDate}
          onChange={this.handleSelectFinishDate}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    );

    const breakLengthPicker = (
      <TextField
        id="standard-number"
        value={this.state.selectedBreakLength}
        onChange={this.handleSelectBreakLength}
        type="number"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    );

    const startDatePickerShiftEdit = (
      <form className={classes.container} noValidate>
        <TextField
          id="datetime"
          type="datetime-local"
          fullWidth
          value={this.state.selectedShiftStartDate}
          onChange={this.handleSelectShiftStartDate}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    );

    const finishDatePickerShiftEdit = (
      <form className={classes.container} noValidate>
        <TextField
          fullWidth
          id="datetime-local"
          type="datetime-local"
          value={this.state.selectedShiftFinishDate}
          onChange={this.handleSelectShiftFinishDate}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    );

    const breakLengthPickerShiftEdit = (
      <TextField
        id="standard-number"
        value={this.state.selectedShiftBreakLength}
        onChange={this.handleSelectShiftBreakLength}
        type="number"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    );

    const shiftEdit = (
      <div className={classes.shiftEdit}>
        <IconButton aria-label="Menu" onClick={event => this.handleUpdateShift(event, this.state.selectedShiftId)}>
          <Save />
        </IconButton>
        <IconButton aria-label="Menu" onClick={event => this.handleDeleteShift(event, this.state.selectedShiftId)}>
          <Delete />
        </IconButton>
        <IconButton aria-label="Menu" onClick={this.handleCancelShiftEdit}>
          <Cancel />
        </IconButton>
      </div>
    );

    if (this.state.currentOrganisationId < 1) {
      shiftTable = (
        <Grid container justify="center" alignItems="center" direction="column">
          <Grid item>
            <CalendarToday className={classes.icon} />
          </Grid>
          <h2 className={classes.text}>Join an organisation to get started!</h2>
        </Grid>

      );
    } else {
      shiftTable = (
        <Paper className={classes.root}>
          <Grid container justify="flex-end" alignItems="flex-start">
            <IconButton className={classes.exit} aria-label="Menu" onClick={this.handleDeleteShiftsOnLeave}>
              <Cancel />
            </IconButton>
          </Grid>

          <Grid container justify="center" alignItems="center" direction="column">
            <h1 className={classes.text}>{this.state.currentOrganisationName}</h1>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Employee Name</TableCell>
                <TableCell align="right">Shift Start</TableCell>
                <TableCell align="right">Shift Finish</TableCell>
                <TableCell align="right">Break Length</TableCell>
                <TableCell align="right">Time Worked</TableCell>
                <TableCell align="right">Pay</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.shifts.map(row => (
                <TableRow
                  className={classes.tableRow}
                  key={row.id}
                  onDoubleClick={event => this.handleClickShift(event, row.id)}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{this.state.selectedShift && this.state.selectedShiftId === row.id ? (startDatePickerShiftEdit) : (row.start)}</TableCell>
                  <TableCell align="right">{this.state.selectedShift && this.state.selectedShiftId === row.id ? (finishDatePickerShiftEdit) : (row.finish)}</TableCell>
                  <TableCell align="right">{this.state.selectedShift && this.state.selectedShiftId === row.id ? (breakLengthPickerShiftEdit) : (row.breakLength)}</TableCell>
                  <TableCell align="right">{this.state.selectedShift && this.state.selectedShiftId === row.id ? (<div>——</div>) : (row.timeWorked)}</TableCell>
                  <TableCell align="right">{this.state.selectedShift && this.state.selectedShiftId === row.id ? (shiftEdit) : (`$${row.pay}`)}</TableCell>
                </TableRow>
              ))}
              <TableRow className={classes.tableRow}>
                <TableCell component="th" scope="row">{userPicker}</TableCell>
                <TableCell align="right">{startDatePicker}</TableCell>
                <TableCell align="right">{finishDatePicker}</TableCell>
                <TableCell align="right">{breakLengthPicker}</TableCell>
                <TableCell align="right"> —— </TableCell>
                <TableCell align="right">
                  <Button onClick={this.handleCreateNewShift}>
                    {'Create a New Shift'}
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>

      );
    }

    return (
      <div key={this.state.shifts}>
        {shiftTable}
        <PopUp
          error={this.state.error}
          errorMsg={this.state.errorMsg}
          handleSnackBarClose={this.handleSnackBarClose.bind(this)}
        />
      </div>
    );
  }
}

Shifts.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  cookies: instanceOf(Cookies).isRequired,
  currentUserId: PropTypes.number.isRequired,
  currentOrganisationId: PropTypes.number, // eslint-disable-line react/require-default-props
  organisations: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  leaveOrganisation: PropTypes.func.isRequired,
};

Shifts = withStyles(styles)(Shifts); // eslint-disable-line no-class-assign
export default withCookies(Shifts);
