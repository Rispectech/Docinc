interface formikSignInInitialValues {
  email: String;
  password: String;
}

interface formikSignUpInitialValues extends formikSignInInitialValues {
  name: String;
  confirmPassword: String;
}

interface formPropsType {
  entity: String;
  setHaveAccount: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SignUpComponentProps extends formPropsType {
  registerUser: (body: formikSignUpInitialValues) => Promise<void>;
}

interface verificationDialogProps {
  isVerifModalOpen: boolean;
  handleClose: () => void;
}
