import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ResetButton } from "../../styles/components/auth";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ClientSignUpOptions from "./ClientSignUpOptions";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const emailRegExp =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

const ClientSignUpForm: React.FC<signUpComponentProps> = ({
  entity,
  setHaveAccount,
  registerUser,
}) => {
  const formik = useFormik<formikSignUpInitialValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      companyEmail: "",
      companyMobile: "",
      gst: "",
      organization: "Education",
      qr: 0,
      license: "Qr Based",
      address: "",
      mobile: "",
      location: "",
    },
    onSubmit: (): void => {
      console.log("submitting", formik.values);
      // console.log(formik.errors);
      registerUser(formik.values);
    },
    validationSchema: Yup.object().shape({
      companyEmail: Yup.string()
        .email()
        .matches(emailRegExp, "Email is not valid")
        .required("Required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Required")
        .matches(emailRegExp, "Email is not valid"),
      name: Yup.string().required("Name is Required"),
      mobile: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .length(10, "Enter 10 digit mobile number"),
      companyMobile: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .length(10, "Enter 10 digit mobile number"),
      password: Yup.string().required("Password is Required"),
      confirmPassword: Yup.string()
        .required("Confirmation for Password is Required")
        .test(
          "must be same",
          "Password are not matching",
          (value, ctx) => value === ctx.parent.confirmPassword
        ),
    }),
  });

  console.log(formik.values);

  return (
    <Box
      sx={{
        my: 3,
        mx: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxHeight: "100vh",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {entity} Sign Up
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item lg={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="companyEmail"
              label="Company Email Address"
              name="companyEmail"
              autoComplete="email"
              autoFocus
              value={formik.values.companyEmail}
              onChange={formik.handleChange}
              error={formik.touched.companyEmail && Boolean(formik.errors.companyEmail)}
              helperText={
                formik.touched.companyEmail &&
                formik.errors.companyEmail &&
                String(formik.errors.companyEmail)
              }
            />
          </Grid>

          {/* <Grid item lg={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="companyName"
              label="Company Name"
              id="companyName"
              autoComplete="company name"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              error={formik.touched.companyName && Boolean(formik.errors.companyName)}
              helperText={
                formik.touched.companyName &&
                formik.errors.companyName &&
                String(formik.errors.companyName)
              }
            />
          </Grid>

          <Grid item lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="address"
              label="Company Address"
              id="address"
              autoComplete="name"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={
                formik.touched.address &&
                formik.errors.address &&
                String(formik.errors.address)
              }
            />
          </Grid>

          <Grid item lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="companyMobile"
              label="Company Mobile Number"
              type="text"
              id="companyMobile"
              autoComplete="name"
              value={formik.values.companyMobile}
              onChange={formik.handleChange}
              error={formik.touched.companyMobile && Boolean(formik.errors.companyMobile)}
              helperText={
                formik.touched.companyMobile &&
                formik.errors.companyMobile &&
                String(formik.errors.companyMobile)
              }
            />
          </Grid>

          <Grid item lg={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="gst"
              label="Gst no"
              type="text"
              id="gst"
              autoComplete="gst"
              value={formik.values.gst}
              onChange={formik.handleChange}
              error={formik.touched.gst && Boolean(formik.errors.gst)}
              helperText={formik.touched.gst && formik.errors.gst && String(formik.errors.gst)}
            />
          </Grid>

          <Grid item lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Contact Person name"
              type="name"
              id="name"
              autoComplete="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={
                formik.touched.name && formik.errors.name && String(formik.errors.name)
              }
            />
          </Grid>

          <Grid item lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="location"
              label="Company Location"
              type="text"
              id="location"
              autoComplete="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={
                formik.touched.location &&
                formik.errors.location &&
                String(formik.errors.location)
              }
            />
          </Grid>

          <Grid item lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Contact Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && String(formik.errors.email)}
            />
          </Grid>

          <Grid item lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="mobile"
              label="Contact Mobile Number"
              type="text"
              id="mobile"
              autoComplete="name"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={
                formik.touched.mobile && formik.errors.mobile && String(formik.errors.mobile)
              }
            />
          </Grid>

          <Grid item lg={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-helper-label">License Type</InputLabel>
              <Select
                required
                labelId="demo-simple-select-helper-label"
                id="license"
                value={formik.values.license}
                label="License Type"
                name="license"
                onChange={formik.handleChange}
                error={formik.touched.license && Boolean(formik.errors.license)}
                fullWidth
              >
                <MenuItem value={"Qr Based"}>Qr Based</MenuItem>
                <MenuItem value={"Tenure Based"}>Tenure Based</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="qr"
              label="Qr Quota"
              type="text"
              id="qr"
              autoComplete="name"
              value={formik.values.qr}
              onChange={formik.handleChange}
              error={formik.touched.qr && Boolean(formik.errors.qr)}
              helperText={formik.touched.qr && formik.errors.qr && String(formik.errors.qr)}
              sx={{
                marginTop: 0,
              }}
            />
          </Grid>

          <Grid item lg={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-helper-label">Organization Type</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="organization"
                value={formik.values.organization}
                label="Organization Type"
                name="organization"
                onChange={formik.handleChange}
                error={
                  formik.touched.organization &&
                  Boolean(formik.errors.organization) &&
                  Boolean(formik.errors.organization)
                }
                fullWidth
              >
                <MenuItem value={"Education"}>Education</MenuItem>
                <MenuItem value={"Insurance"}>Insurance</MenuItem>
                <MenuItem value={"Bank"}>Bank</MenuItem>
                <MenuItem value={"Others"}>Others</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                formik.touched.password &&
                formik.errors.password &&
                String(formik.errors.password)
              }
            />
          </Grid>

          <Grid item lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={
                formik.touched.confirmPassword &&
                formik.errors.confirmPassword &&
                String(formik.errors.confirmPassword)
              }
            />
          </Grid> */}

          <ClientSignUpOptions formik={formik} signin={true} />
        </Grid>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign Up
        </Button>
        <Grid container>
          <Grid item>
            <ResetButton variant="body2" onClick={() => setHaveAccount(true)}>
              {"Don't have an account? Sign Up"}
            </ResetButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export { ClientSignUpForm, Copyright };
