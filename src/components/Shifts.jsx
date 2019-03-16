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

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class Shifts extends React.Component {
  state = {
    shifts: [],
    currentUserId: 0,
    currentOrganisationId: 0,
    currentOrganisationHourly: 0,
    currentOrganisationMembers: [],
  };

  componentDidMount() {
    this.getCurrentOrganisationUsers();
    this.getCurrentUserId();
    this.getOrganisations();
    this.getShifts();
  }

  getCurrentUserId() {
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
              currentUserId: response.id,
              currentOrganisationId: response.organisationId,
            });
          } else {
            console.log(response.error);
          }
        })
        .catch(error => console.error('Error:', error));
    })();
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
              this.state.currentOrganisationMembers.push(response[i]);
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
      if (organisations[i].id === this.state.currentOrganisationId){
        this.setState({
          currentOrganisationHourly: organisations[i].hourlyRate,
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
            for (let i = 0; i < response.length; i += 1) {
              this.state.shifts.push(response[i]);
              this.matchNames([i]);
              this.calculateTimeAndPay([i]);
            }
          } else {
            console.log(response.error);
          }
        })
        .catch(error => console.error('Error:', error));
    })();
  }

  handleCreateNewShift = (event) => {
    event.preventDefault();
    const { cookies } = this.props;

    (async () => {
      await fetch('http://localhost:3000/shifts', {
        headers: {
          Authorization: cookies.get('sessionId'),
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          userId: this.state.currentUserId,
          start: '2018-01-03 10:00',
          finish: '2018-01-03 17:00',
          breakLength: 35,
        }),
      }).then(() => {
        this.getShifts();
      }).catch(error => console.error('Error:', error));
    })();
  };

  matchNames(shift) {
    for (let i = 0; i < this.state.currentOrganisationMembers.length; i += 1) {
      if (this.state.shifts[shift].userId === this.state.currentOrganisationMembers[i].id) {
        this.state.shifts[shift].name = this.state.currentOrganisationMembers[i].name;
      }
    }
  }

  calculateTimeAndPay(shift) {
    const start = new Date(this.state.shifts[shift].start);
    const finish = new Date(this.state.shifts[shift].finish);
    const breakLength = parseInt(this.state.shifts[shift].breakLength, 10);

    const diff = Math.abs(finish - start);
    const totalMinutes = (Math.floor((diff / 1000) / 60)) - breakLength;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    this.state.shifts[shift].timeWorked = (`${hours} hours, ${minutes} minutes`);

    const payThresholds = Math.floor(totalMinutes / 15);
    this.state.shifts[shift].pay = payThresholds * (this.state.currentOrganisationHourly / 4);
  }

  render() {
    const { classes } = this.props;
    let shiftTable;

    if (this.state.shifts.length === 0) {
      shiftTable = (
        <div>Join or Create New Organisation From the Menu</div>
      );
    } else {
      shiftTable = (
        <Paper className={classes.root}>
          <Table className={classes.table}>
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
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.start}</TableCell>
                  <TableCell align="right">{row.finish}</TableCell>
                  <TableCell align="right">{row.breakLength}</TableCell>
                  <TableCell align="right">{row.timeWorked}</TableCell>
                  <TableCell align="right">{"$" + row.pay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

      );
    }

    return (
      <div>
        {shiftTable}
        <Button onClick={this.handleCreateNewShift}>
          {'Create a New Shift'}
        </Button>
      </div>
    );
  }
}

Shifts.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  cookies: instanceOf(Cookies).isRequired,
  currentOrganisationHourly: PropTypes.number.isRequired,
};

Shifts = withStyles(styles)(Shifts); // eslint-disable-line no-class-assign
export default withCookies(Shifts);
