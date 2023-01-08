import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useAppContext } from "../context/context";

const Home: NextPage = () => {
  const router = useRouter();
  const { entity, isUserAuthenticated, isLoading } = useAppContext();
  console.log(useAppContext());
  React.useEffect(() => {
    // checks if the user is authenticated
    console.log(isUserAuthenticated());
    if (!isLoading) isUserAuthenticated() ? router.push("/") : router.push("/admin/signin");
  }, []);
  return <> {isLoading ? "Loading..." : "  entity signin"}</>;
};

export default Home;
