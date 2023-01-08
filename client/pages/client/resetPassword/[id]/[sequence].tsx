import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import axios from "axios";

const theme = createTheme();

export default function SignIn() {
  const router = useRouter();
  const [isPasswordSame, setIsPasswordSame] = React.useState(true);
  const [isTokenValid, setIsTokenValid] = React.useState(true);
  const {
    query: { id, sequence },
  } = router;

  console.log(id, sequence);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("password"),
      password: data.get("confirmPassword"),
    });

    if (data.get("password") !== data.get("confirmPassword")) {
      setIsPasswordSame(false);
    }

    if (data.get("password") === data.get("confirmPassword")) {
      setIsPasswordSame(true);
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/client/resetPassword`,
        {
          id,
          resetSequence: sequence,
          newPassword: data.get("password"),
        }
      );
      console.log(res, res.status);
      if (res.status !== 200) {
        setIsTokenValid(false);
      }
    } catch (error) {}
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Client Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="confirm-password"
              error={!isPasswordSame}
              helperText={!isPasswordSame && "Password dont match"}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Reset Password
            </Button>
          </Box>

          {!isTokenValid && (
            <Typography color={"red"} variant="body2">
              Link has expired or Wrong Sequence input
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
