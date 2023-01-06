import { styled } from "@mui/material/styles";

const DivContainer = styled("div")({
  position: "relative",
  height: "100%",
  maxHeight: "100vh",
  display: "block",
  top: 0,
  backgroundColor: "#00356B",

  "& #fix": {
    height: "calc(100% - 10px)",
  },

  "& #tsparticles": {
    // position: "absolute",
    width: "100%",
    height: "100%",
    top: "0",
    bottom: "0",
    right: "0",
    padding: "0",
    margin: "0",
    zIndex: "0",
  },

  "& #content": {
    position: "absolute",
    top: "50%",
    right: "50%",
    transform: "translate(50%,-50%)",
    color: "#fff",
    maxWidth: "90%",
    padding: " 2em 3em",
    background: "rgba(0, 0, 0, 0.4)",
    textShadow: " 0px 0px 2px #131415",
    fontFamily: "'Open Sans', sans-serif",

    "& > h1": {
      fontSize: "2.25em",
      fontWeight: 700,
      letterSpacing: "-1px",
    },
  },
});

export { DivContainer };
