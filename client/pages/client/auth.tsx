import * as React from "react";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ParticleComponent from "../../components/global/particles";
import { SignInForm } from "../../components/global/SigninForm";
import { SignUpForm } from "../../components/global/SignUpForm";
const theme = createTheme();

const UserAuth = () => {
  const [haveAccount, setHaveAccount] = React.useState(true);

  const FormProps = {
    entity: "Client",
    setHaveAccount,
  };

  const registerUser = async (body: formikSignUpInitialValues) => {
    try {
      const res = axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/user/register`,
        body
      );
      console.log(res);
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
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default UserAuth;
