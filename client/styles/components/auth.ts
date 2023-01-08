import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const ResetButton = styled(Typography)({
  margin: 0,
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  fontWeight: 400,
  fontSize: "0.875rem",
  lineHeight: 1.43,
  letterSpacing: "0.01071em",
  color: "#1976d2",
  // -webkit-text-decoration: underline;
  textDecoration: "underline",
  textDecorationColor: "rgba(25, 118, 210, 0.4)",

  "&:hover": {
    textDecorationColor: "inherit",
    cursor: "pointer",
  },
});

export { ResetButton };
