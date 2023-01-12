import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FormikProps } from "formik";

interface clientSignUpOptionsProps {
  formik: FormikProps<formikSignUpInitialValues>;
}
const ClientSignUpOptions: React.FC<clientSignUpOptionsProps> = ({ formik }) => {
  return (
    <>
      <Grid item lg={12}>
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
            formik.touched.address && formik.errors.address && String(formik.errors.address)
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
          helperText={formik.touched.name && formik.errors.name && String(formik.errors.name)}
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
            formik.touched.location && formik.errors.location && String(formik.errors.location)
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
            formik.touched.password && formik.errors.password && String(formik.errors.password)
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
      </Grid>
    </>
  );
};

export default ClientSignUpOptions;
