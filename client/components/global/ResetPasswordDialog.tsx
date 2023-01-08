import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ResetPasswordDialog: React.FC<resetPasswordDialogProps> = ({
  isResetModalOpen,
  handleClose,
  handleForgetPassword,
}) => {
  const [email, setEmail] = React.useState("");
  const [isEmailSent, setIsEmailSent] = React.useState(false);

  const handleFlow = () => {
    const bol = handleForgetPassword(email) as unknown as boolean;
    if (bol) {
      setIsEmailSent(true);
    }
  };

  const handleCloseFlow = () => {
    handleClose();
    setIsEmailSent(false);
  };

  return (
    <Dialog open={isResetModalOpen} onClose={handleClose}>
      <DialogTitle>Verification</DialogTitle>

      {!isEmailSent ? (
        <DialogContent>
          <DialogContentText>
            Please enter the email where you want to have the reset link
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="text"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Email has been sent
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        {!isEmailSent ? (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                handleFlow();
              }}
            >
              Send
            </Button>
          </>
        ) : (
          <Button onClick={handleCloseFlow}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordDialog;
