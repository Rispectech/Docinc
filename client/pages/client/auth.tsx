import * as React from "react";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ParticleComponent from "../../components/global/particles";
import { SignInForm } from "../../components/global/SigninForm";
import { SignUpForm } from "../../components/global/SignUpForm";
import VerificationDialog from "../../components/global/VerificationDialog";
const theme = createTheme();

const UserAuth = () => {
  const [haveAccount, setHaveAccount] = React.useState(true);
  const [isVerifModalOpen, setIsVerifModalOpen] = React.useState(false);

  const FormProps = {
    entity: "Client",
    setHaveAccount,
  };

  const handleClose = () => {
    setIsVerifModalOpen(false);
  };

  const handleVerification = async (otp: string) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/client/register`,
      {
        otp,
      }
    );
  };

  const registerUser = async (body: formikSignUpInitialValues) => {
    try {
      console.log(process.env.NEXT_PUBLIC_SERVER_ENDPOINT);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/client/register`,
        body
      );
      console.log(res);
      if (res.status === 200) {
        setIsVerifModalOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7}>
          <ParticleComponent />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          {haveAccount ? (
            <SignInForm {...FormProps} />
          ) : (
            <SignUpForm {...FormProps} registerUser={registerUser} />
          )}
          <VerificationDialog handleClose={handleClose} isVerifModalOpen={isVerifModalOpen} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default UserAuth;
