const getGoogleAuthUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URL,
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://googleapis.com/auth/userinfo.profile",
      "https://googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  console.log(options);
  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};

export default getGoogleAuthUrl;
