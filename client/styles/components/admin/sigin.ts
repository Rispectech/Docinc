import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const SignInLinkContainer = styled(Grid)({
  margin: "2rem 1rem",
  textAlign: "center",
  fontSize: "1.2rem",

  "& span": {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    fontWeight: 400,
    color: "#1976d2",
    // -webkit-text-decoration: underline;
    textDecoration: "underline",
    textDecorationColor: "rgba(25, 118, 210, 0.4)",

    "&:hover": {
      textDecorationColor: "inherit",
      cursor: "pointer",
    },
  },
});

export { SignInLinkContainer };
