import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useAppContext } from "../context/context";

const Home: NextPage = () => {
  const router = useRouter();
  const { entity, isUserAuthenticated, isLoading } = useAppContext();
  const authenticated = isUserAuthenticated();
  // console.log(useAppContext());
  React.useEffect(() => {
    // checks if the user is authenticated
    console.log("user authenticated :  ", isUserAuthenticated(), isLoading);
    if (!isLoading) isUserAuthenticated() ? router.push("/") : router.push("/admin/signin");
  }, [isLoading, authenticated]);

  return <> {isLoading ? "Loading..." : `${entity} signin`}</>;
};

export default Home;
