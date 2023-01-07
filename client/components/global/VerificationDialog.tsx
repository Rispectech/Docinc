import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const VerificationDialog: React.FC<verificationDialogProps> = ({
  isVerifModalOpen,
  handleClose,
}) => {
  return (
    <Dialog open={isVerifModalOpen} onClose={handleClose}>
      <DialogTitle>Verification</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To access the Website , Please verify your account and enter the OTP sent through
          your email
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="OTP"
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Verify</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerificationDialog;
