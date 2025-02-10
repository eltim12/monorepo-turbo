"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "@/apis/user";
import { updateUserName } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import axios from 'axios'

const EditNamePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  // const [name, setName] = useState(user?.name || "");
  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleNameUpdate = async () => {
    setError(null);
    setSuccess(false);

    if (!auth.currentUser) {
      setError("No authenticated user.");
      return;
    }

    try {
      await updateUserName(auth.currentUser, name);
      dispatch(updateUserName(name)); 
      await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/update-user-data`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${auth.currentUser.accessToken}`, // Include token in headers
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(true);
      
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Edit data
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Name updated successfully!</Alert>}
      <TextField
        fullWidth
        label="New name"
        margin="normal"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button fullWidth variant="contained" color="primary" onClick={handleNameUpdate}>
        Update name
      </Button>
    </Container>
  );
};

export default EditNamePage;
