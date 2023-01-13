import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActions, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

interface FeaturedPostProps {
  post: {
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
  };
  deleteClient: (_id: string) => void;
  handleOpen: () => void;
}

export default function FeaturedPost(props: FeaturedPostProps) {
  const { post, deleteClient, handleOpen } = props;

  // console.log(post);
  return (
    <CardActionArea component="a" href="#">
      <Card sx={{ display: "flex" }}>
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h2" variant="h5">
            {post.companyName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {post.companyEmail}
          </Typography>
          <Typography variant="subtitle1" paragraph>
            {post.location}
          </Typography>
        </CardContent>

        <CardActions>
          <IconButton onClick={handleOpen}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteClient(post._id)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </CardActionArea>
  );
}
