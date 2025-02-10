"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/apis/user";
import { loginStart, loginSuccess, loginFailure } from "@/store/authSlice";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    dispatch(loginStart());
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential) {
        const user = userCredential.user;
        const accessToken = await user.getIdToken(); 

        dispatch(
          loginSuccess({
            uid: user.uid,
            email: user.email,
            accessToken,
            providerData: [],
            displayName: null
          })
        );
        setSuccess(true);
        router.push("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("email / password wrong.");
        dispatch(loginFailure(error.message));
      } else {
        dispatch(loginFailure("email / password wrong."));
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">login success!</Alert>}
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
};

export default LoginPage;
