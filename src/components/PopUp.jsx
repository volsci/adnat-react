import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

const PopUp = ({ error, errorMsg, handleSnackBarClose }) => (
  <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    open={error}
    autoHideDuration={3000}
    onClose={handleSnackBarClose}
    ContentProps={{
      'aria-describedby': 'message-id',
    }}
    message={<span id="message-id">{errorMsg}</span>}
    action={[
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={handleSnackBarClose}
      >
        <CloseIcon />
      </IconButton>,
    ]}
  />
);

PopUp.propTypes = {
  error: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  handleSnackBarClose: PropTypes.func.isRequired,
};

export default PopUp;
