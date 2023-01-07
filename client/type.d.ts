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

interface SignInComponentProps extends formPropsType {
  loginUser: (body: formikSignInInitialValues) => Promise<void>;
}

interface verificationDialogProps {
  isVerifModalOpen: boolean;
  handleClose: () => void;
  handleVerification: (otp: string) => Promise<void>;
}

interface ClientType {
  createdAt: String;
  email: String;
  name: String;
  updatedAt: String;
  verified: Boolean;
  __v: number;
  _id: String;
}

interface AuthContextType {
  accessToken: String;
}

interface ChildrenPropsType {
  children: React.ReactNode;
}
