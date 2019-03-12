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
    // rows: [],
    currentUserId: 0,
    currentOrganisationMemberIds: [],
  };

  componentDidMount() {
    this.getCurrentUserId();
    this.getCurrentOrganisationUsers();
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
              this.state.currentOrganisationMemberIds.push(response[i].id);
            }
          } else {
            console.log(response.error);
          }
        })
        .catch(error => console.error('Error:', error));
    })();
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
            console.log(response);
            for (let i = 0; i < response.length; i += 1) {
              this.state.shifts.push(response[i]);
            }
            console.log(this.state.shifts);
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
          start: '2018-01-03 10:15',
          finish: '2018-01-03 12:20',
          breakLength: 30,
        }),
      }).then(() => {
        this.getShifts();
      }).catch(error => console.error('Error:', error));
    })();
  };

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
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.shifts.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.userId}
                  </TableCell>
                  <TableCell align="right">{row.start}</TableCell>
                  <TableCell align="right">{row.finish}</TableCell>
                  <TableCell align="right">{row.breakLength}</TableCell>
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
};

Shifts = withStyles(styles)(Shifts); // eslint-disable-line no-class-assign
export default withCookies(Shifts);
