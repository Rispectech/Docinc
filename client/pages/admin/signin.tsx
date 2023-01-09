import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ParticleComponent from "../../components/global/Particles";
import { SignInForm } from "../../components/global/SigninForm";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/context";
import { setCookie } from "../../utils/Cookies";
import axios from "axios";
import ResetPasswordDialog from "../../components/global/ResetPasswordDialog";
import VerificationDialog from "../../components/global/VerificationDialog";

const theme = createTheme();

export default function SignInSide() {
  const router = useRouter();
  const { createSession } = useAppContext();
  const [haveAccount, setHaveAccount] = React.useState(true);
  const [isVerifModalOpen, setIsVerifModalOpen] = React.useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = React.useState(false);
  const [clientInfo, setClientInfo] = React.useState<clientType | undefined>();

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
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/admin/verifyOtp`,
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
          await createSession("Admin", clientInfo?.accessToken);
          setCookie("refreshToken", clientInfo?.refreshToken as String, 2);
          setCookie("entity", "Admin", 2);
          router.push("/");
        }
      }
    } catch (error) {}
  };

  const loginUser = async (body: formikSignInInitialValues) => {
    try {
      console.log(process.env.NEXT_PUBLIC_SERVER_ENDPOINT);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/admin/login`,
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

  const handleForgetPassword = async (email: string) => {
    try {
      console.log(process.env.NEXT_PUBLIC_SERVER_ENDPOINT);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/admin/requestPasswordReset`,
        {
          email: email,
          redirectUrl: `${process.env.NEXT_PUBLIC_WEB_ENDPOINT}/admin/resetPassword`,
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
          <SignInForm
            loginUser={loginUser}
            handleResetOpen={handleResetOpen}
            entity={"Admin"}
            setHaveAccount={setHaveAccount}
          />
        </Grid>
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
    </ThemeProvider>
  );
}
