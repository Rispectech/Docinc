import * as React from "react";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ParticleComponent from "../../components/global/Particles";
import { SignInForm } from "../../components/global/SigninForm";
import { SignUpForm } from "../../components/global/SignUpForm";
import VerificationDialog from "../../components/global/VerificationDialog";
import { useAppContext } from "../../context/context";
import { setCookie } from "../../utils/Cookies";
import { useRouter } from "next/router";
import ResetPasswordDialog from "../../components/global/ResetPasswordDialog";
const theme = createTheme();

const UserAuth = () => {
  const router = useRouter();
  const {
    query: { signin },
  } = router;

  const resolveQuery = () => {
    if (signin === "N") return false;
    else return true;
  };

  console.log(signin, resolveQuery(), signin === undefined);

  const { createSession } = useAppContext();
  const [haveAccount, setHaveAccount] = React.useState<boolean>(resolveQuery());
  const [isVerifModalOpen, setIsVerifModalOpen] = React.useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = React.useState(false);
  const [clientInfo, setClientInfo] = React.useState<clientType | undefined>();

  const FormProps = {
    entity: "User",
    setHaveAccount,
  };

  const handleClose = () => {
    setIsVerifModalOpen(false);
    setIsResetModalOpen(false);
  };

  const handleResetOpen = () => {
    setIsResetModalOpen(true);
  };

  const handleVerification = async (otp: string) => {
    try {
      console.log(otp);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/user/verifyOtp`,
        {
          otp,
          id: clientInfo?._id,
        }
      );
      console.log(res);
      if (res.status === 200) {
        setIsVerifModalOpen(false);
        setHaveAccount(true);

        if (clientInfo?.accessToken) {
          await createSession("User", clientInfo?.accessToken);
          setCookie("refreshToken", clientInfo?.refreshToken as String, 2);
          setCookie("entity", "User", 2);
          router.push("/");
        }
      }
    } catch (error) {}
  };

  const registerUser = async (body: formikSignUpInitialValues) => {
    try {
      console.log(process.env.NEXT_PUBLIC_SERVER_ENDPOINT);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/user/register`,
        body
      );
      console.log(res);
      if (res.status === 200) {
        setIsVerifModalOpen(true);
        setClientInfo(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginUser = async (body: formikSignInInitialValues) => {
    try {
      console.log(process.env.NEXT_PUBLIC_SERVER_ENDPOINT);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/user/login`,
        body
      );
      console.log(res);
      if (res.status === 200) {
        setIsVerifModalOpen(true);
        setClientInfo(res.data.data);
      }
    } catch (error: any) {
      console.log(error);
      return error.response;
    }
  };

  const googleLogin = async () => {
    try {
      // console.log(process.env.NEXT_PUBLIC_SERVER_ENDPOINT);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/user/oauth/google`
      );
      console.log(res);
      if (res.status === 200) {
        setIsVerifModalOpen(true);
        const client = res.data.data;
        await createSession("User", client?.accessToken);
        setCookie("refreshToken", client?.refreshToken as String, 2);
        setCookie("entity", "User", 2);
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      return error.response;
    }
  };

  const handleForgetPassword = async (email: string) => {
    try {
      console.log(process.env.NEXT_PUBLIC_SERVER_ENDPOINT);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/user/requestPasswordReset`,
        {
          email: email,
          redirectUrl: `${process.env.NEXT_PUBLIC_WEB_ENDPOINT}/user/resetPassword`,
        }
      );
      console.log(res);
      if (res.status === 200) return true;
      else return false;
    } catch (error) {}
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
            <SignInForm
              {...FormProps}
              loginUser={loginUser}
              handleResetOpen={handleResetOpen}
              googleLogin={googleLogin}
            />
          ) : (
            <SignUpForm {...FormProps} registerUser={registerUser} />
          )}
          <VerificationDialog
            handleClose={handleClose}
            isVerifModalOpen={isVerifModalOpen}
            handleVerification={handleVerification}
            clientInfo={clientInfo}
          />
          <ResetPasswordDialog
            handleClose={handleClose}
            isResetModalOpen={isResetModalOpen}
            handleForgetPassword={handleForgetPassword}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default UserAuth;
