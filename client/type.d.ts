interface formikSignInInitialValues {
  email: string;
  password: string;
}

interface formikSignUpInitialValues extends formikSignInInitialValues {
  name: string;
  confirmPassword: string;
}

interface formPropsType {
  entity: string;
  setHaveAccount: React.Dispatch<React.SetStateAction<boolean>>;
}

interface signUpComponentProps extends formPropsType {
  registerUser: (body: formikSignUpInitialValues) => Promise<void>;
}

interface signInComponentProps extends formPropsType {
  loginUser: (body: formikSignInInitialValues) => Promise<void>;
  handleResetOpen: () => void;
}

interface verificationDialogProps {
  isVerifModalOpen: boolean;
  handleClose: () => void;
  handleVerification: (otp: string) => Promise<void>;
  clientInfo: clientType | undefined;
}

interface clientType {
  createdAt: string;
  email: string;
  name: string;
  updatedAt: string;
  verified: Boolean;
  __v: number;
  _id: string;
  accessToken?: string;
  refreshToken?: string;
}

interface authContextType extends authStateContextType {
  createSession: (entity: string, accessToken: string) => void;
  isUserAuthenticated: () => !!authState.token;
}

interface authStateContextType {
  accessToken: string;
  entity: string;
  isLoading: boolean;
}

interface childrenPropsType {
  children: React.ReactNode;
}

interface createSessionType {
  accessToken: string;
  entity: string;
}

interface resetPasswordDialogProps {
  isResetModalOpen: boolean;
  handleClose: () => void;
  handleForgetPassword: (email: string) => Promise<boolean | undefined>;
}

interface signinRequestErrors {
  error: string;
  message: {
    email: string;
    password: string;
  };
}
