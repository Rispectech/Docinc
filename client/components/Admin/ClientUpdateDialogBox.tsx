import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import ClientSignUpOptions from "../Client/ClientSignUpOptions";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const emailRegExp =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

const ClientUpdateDialogBox: React.FC<clientUpdateDialogProps> = ({
  handleClose,
  isUpdateModalOpen,
  clientInfo,
  signin,
  updateClient,
}) => {
  const formik = useFormik<formikSignUpInitialValues>({
    enableReinitialize: true,
    // initialValues: {
    //   name: clientInfo && clientInfo.name,
    //   email: "",
    //   password: "",
    //   confirmPassword: "",
    //   companyName: "",
    //   companyEmail: "",
    //   companyMobile: "",
    //   gst: "",
    //   organization: "Education",
    //   qr: 0,
    //   license: "Qr Based",
    //   address: "",
    //   mobile: "",
    //   location: "",
    // },
    initialValues: {
      ...clientInfo,
      confirmPassword: "",
      password: "",
      license: clientInfo ? clientInfo.license : "Tenure Based",
      organization: clientInfo ? clientInfo.organization : "Others",
    },
    onSubmit: (): void => {
      console.log("submitting", formik.values);
      updateClient(formik.values);
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
    }),
  });

  // console.log(formik.values);

  useEffect(() => {
    // console.log(clientInfo);
  }, [clientInfo]);
  return (
    <Dialog open={isUpdateModalOpen} onClose={handleClose}>
      <DialogTitle>Update the Clients Information</DialogTitle>

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        <DialogContent>
          <DialogContentText>
            To access the Website , Please verify your account and enter the OTP sent through
            your email
          </DialogContentText>

          <Grid container spacing={2}>
            <ClientSignUpOptions formik={formik} signin={false} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Update</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ClientUpdateDialogBox;
