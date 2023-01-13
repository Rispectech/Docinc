interface formikSignInInitialValues {
  email: string;
  password: string;
}

interface formikSignUpInitialValues extends formikSignInInitialValues {
  name: string;
  confirmPassword: string;
  companyName: string;
  address: string;
  companyMobile: string;
  companyEmail: string;
  gst: string;
  mobile: string;
  license: string;
  qr: number;
  organization: string;
  location: string;
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
  googleLogin?: () => void;
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

interface clientUpdateDialogProps {
  isUpdateModalOpen: boolean;
  handleClose: () => void;
  clientInfo: clientInfoType;
  signin: boolean;
  updateClient: (body: formikSignUpInitialValues) => void;
}

interface clientInfoType {
  name: string;
  companyName: string;
  address: string;
  companyMobile: string;
  companyEmail: string;
  gst: string;
  mobile: string;
  license: string;
  qr: number;
  organization: string;
  location: string;
  _id: string;
  email: string;
  // _v: string;
  // createdAt: string;
  // updatedAt: string;
}

interface FeaturedPostProps {
  post: clientInfoType;
  deleteClient: (_id: string) => void;
  handleOpen: () => void;
}
