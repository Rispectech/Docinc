import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Hero from "../global/Hero";
import Header from "../global/Navbar";
import { useAppContext } from "../../context/context";

const heroProps = {
  description: "Manage Registered Client : Update , Delete ",
  image: "/admin-hero.jpg",
  imageText: "Manage Registered Client : Update , Delete ",
  title: "Admin Dashboard",
};

const AdminDashboard = () => {
  const { accessToken } = useAppContext();
  const [clients, setClients] = useState([]);

  const getClients = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/admin/getAllClients`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log(res);
    } catch (error) {}
  };

  console.log(accessToken, clients);
  useEffect(() => {
    if (accessToken) {
      getClients();
    }
  }, [accessToken]);

  return (
    <Container maxWidth="lg">
      <Header title="Admin Dashboard" />
      <Hero post={heroProps} />
    </Container>
  );
};

export default AdminDashboard;
