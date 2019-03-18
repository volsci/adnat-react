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
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Save from '@material-ui/icons/Save';
import Delete from '@material-ui/icons/Delete';
import Cancel from '@material-ui/icons/Cancel';
import moment from 'moment/src/moment';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  tableRow: {
    height: 60,
  },
  shiftEdit: {
    display: 'flex',
  },
});

class Shifts extends React.Component {
  state = {
    shifts: [],
    // currentUserId: 0,
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
    // this.getCurrentUserId();
    this.getOrganisations();
    this.getShifts();
  }

  // getCurrentUserId() {
  //   const { cookies } = this.props;
  //
  //   (async () => {
  //     await fetch('http://localhost:3000/users/me', {
  //       headers: {
  //         Authorization: cookies.get('sessionId'),
  //         'Content-Type': 'application/json',
  //       },
  //       method: 'GET',
  //     }).then(res => res.json())
  //       .then((response) => {
  //         if (response.error === undefined) {
  //           this.setState({
  //             currentUserId: response.id,
  //             currentOrganisationId: response.organisationId,
  //           });
  //         } else {
  //           console.log(response.error);
  //         }
  //       })
  //       .catch(error => console.error('Error:', error));
  //   })();
  // }

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
          } else {
            console.log(response.error);
          }
        })
        .catch(error => console.error('Error:', error));
    })();
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
            this.getCurrentOrganisationHourly(response);
          } else {
            console.log(response.error);
          }
        })
        .catch(error => console.error('Error:', error));
    })();
  }

  getCurrentOrganisationHourly(organisations) {
    for (let i = 0; i < organisations.length; i += 1) {
      if (organisations[i].id === this.state.currentOrganisationId) {
        this.setState({
          currentOrganisationHourly: organisations[i].hourlyRate,
        });
      }
    }
  }

  getShifts() {
    const { cookies } = this.props;

    this.setState({
      selectedShift: false,
      selectedShiftId: 0,
    });

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
            for (let i = 0; i < response.length; i += 1) {
              this.state.shifts.push(response[i]);
              this.matchNames([i]);
              this.calculateTimeAndPay([i]);
            }
            console.log(this.state.shifts);
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
        this.getShifts();
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

  handleDoubleClickShift = (event, shift) => {
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
      if (this.state.shifts[shift].userId === this.state.currentOrganisationUsers[i].id) {
        this.state.shifts[shift].name = this.state.currentOrganisationUsers[i].name;
      }
    }
  }

  calculateTimeAndPay(shift) {
    const startFormat = moment(this.state.shifts[shift].start).format('llll');
    const finishFormat = moment(this.state.shifts[shift].finish).format('llll');

    const start = moment(startFormat);
    const finish = moment(finishFormat);

    const breakLength = parseInt(this.state.shifts[shift].breakLength, 10);

    const totalMinutes = finish.diff(start, 'minutes') - breakLength;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    this.state.shifts[shift].timeWorked = (`${hours} hours, ${minutes} minutes`);

    const payThresholds = Math.floor(totalMinutes / 15);
    this.state.shifts[shift].pay = payThresholds * (this.state.currentOrganisationHourly / 4);
  }

  render() {
    const { classes } = this.props;
    let shiftTable;

    const userPicker = (
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel htmlFor="employee-simple">Employee</InputLabel>
        <Select
          value={this.state.selectedUser}
          onChange={this.handleSelectUser}
          label="Employee"
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
          label="Start"
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
          label="Finish"
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
        label="Break Length"
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
          label="Start"
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
          label="Finish"
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
        label="Break Length"
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

    if (this.state.currentOrganisationId === 0) {
      shiftTable = (
        <div>Join or Create New Organisation From the Menu</div>
      );
    } else {
      shiftTable = (
        <Paper className={classes.root}>
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
                  onDoubleClick={event => this.handleDoubleClickShift(event, row.id)}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{this.state.selectedShift && this.state.selectedShiftId === row.id ? (startDatePickerShiftEdit) : (row.start)}</TableCell>
                  <TableCell align="right">{this.state.selectedShift && this.state.selectedShiftId === row.id ? (finishDatePickerShiftEdit) : (row.finish)}</TableCell>
                  <TableCell align="right">{this.state.selectedShift && this.state.selectedShiftId === row.id ? (breakLengthPickerShiftEdit) : (row.breakLength)}</TableCell>
                  <TableCell align="right">{this.state.selectedShift && this.state.selectedShiftId === row.id ? (<div />) : (row.timeWorked)}</TableCell>
                  <TableCell align="right">{this.state.selectedShift && this.state.selectedShiftId === row.id ? (shiftEdit) : (`$${row.pay}`)}</TableCell>
                </TableRow>
              ))}
              <TableRow className={classes.tableRow}>
                <TableCell component="th" scope="row">{userPicker}</TableCell>
                <TableCell align="right">{startDatePicker}</TableCell>
                <TableCell align="right">{finishDatePicker}</TableCell>
                <TableCell align="right">{breakLengthPicker}</TableCell>
                <TableCell align="right" />
                <TableCell align="center">
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
      <div>
        {shiftTable}

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

Shifts.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  cookies: instanceOf(Cookies).isRequired,
};

Shifts = withStyles(styles)(Shifts); // eslint-disable-line no-class-assign
export default withCookies(Shifts);
