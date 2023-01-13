import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Hero from "../global/Hero";
import Header from "../global/Navbar";
import { useAppContext } from "../../context/context";
import FeaturedPost from "../global/Featured";
import ClientUpdateDialogBox from "./ClientUpdateDialogBox";

const heroProps = {
  description: "Manage Registered Client : Update , Delete ",
  image: "/admin-hero.jpg",
  imageText: "Manage Registered Client : Update , Delete ",
  title: "Admin Dashboard",
};

const AdminDashboard = () => {
  const { accessToken } = useAppContext();
  const [clients, setClients] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState("");

  const getClients = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/admin/getAllClients`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (res.status === 200) {
        setClients(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteClient = async (_id: string) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/admin/deleteClient`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            _id,
          },
        }
      );
      if (res.status === 200) {
        await getClients();
      }
    } catch (error) {}
  };

  const updateClient = async (body: formikSignUpInitialValues) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/admin/updateClient`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (res.status === 200) {
        setIsUpdateModalOpen(false);
        getClients();
      }
    } catch (error) {}
  };

  useEffect(() => {
    console.log("useEffect working", clients);
    if (accessToken) {
      getClients();
    }
  }, [accessToken]);

  return (
    <>
      <Container maxWidth="lg">
        <Header title="Admin Dashboard" />
        <Hero post={heroProps} />
        {clients &&
          clients.map((item, id) => {
            return (
              <FeaturedPost
                post={item}
                key={id}
                deleteClient={deleteClient}
                handleOpen={() => {
                  setIsUpdateModalOpen(true);
                  setCurrentId((item as clientInfoType)._id);
                }}
              />
            );
          })}
      </Container>
      <ClientUpdateDialogBox
        isUpdateModalOpen={isUpdateModalOpen}
        handleClose={() => setIsUpdateModalOpen(false)}
        clientInfo={
          clients.filter(
            (item: clientInfoType) => item._id === currentId
          )[0] as unknown as clientInfoType
        }
        updateClient={updateClient}
        signin={false}
      />
    </>
  );
};

export default AdminDashboard;
