import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * A reusable confirmation dialog component.
 * @param {object} props
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {function} props.onClose - Function to call when the dialog is closed (e.g., clicking cancel).
 * @param {function} props.onConfirm - Function to call when the confirm button is clicked.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.message - The main content/message of the dialog.
 * @param {string} [props.confirmButtonColor] - A custom hex color or theme color (e.g., 'error', '#d32f2f') for the confirm button.
 */
function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonColor = 'primary', // Default to primary color if not provided
}) {
  // Check if the provided color is a standard Material-UI theme color
  const isThemeColor = ['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(
    confirmButtonColor
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
        <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          // Use the 'color' prop for theme colors, and the 'sx' prop for custom hex codes.
          color={isThemeColor ? confirmButtonColor : 'primary'}
          sx={!isThemeColor ? {
            backgroundColor: confirmButtonColor,
            '&:hover': {
              filter: 'brightness(90%)',
              backgroundColor: confirmButtonColor,
            },
          } : {}}
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;