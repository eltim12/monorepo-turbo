"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "@/apis/user";
import { Button, Typography, Container, Card, CardContent } from "@mui/material";

const MainPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isShowData, setIsShowData] = useState("");
  const [userData, setUserData] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect to login if no user is found
    }
  }, [user, router]);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    router.push("/login");
  };

  const handleUpdate = () => {
    router.push("/update");
  };

  const formatDate = (epochTime) => {
    const date = new Date(epochTime * 1000);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    // Function to add suffix to day
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // Covers 4th to 20th
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${day}${getDaySuffix(day)} ${month}, ${year}`;
  }

  const handleDisplayData = async () => {
    if (!user?.accessToken) {
      console.error("No access token available.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/fetch-user-data`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`, // Include token in headers
        },
      });
      setUserData(response.data)
      setIsShowData(true)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Welcome, {user?.email}!
        {
          isShowData && <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography> Name: {userData?.name}</Typography>
              <Typography> Age: {userData?.age}</Typography>
              <Typography>Number of rents: {userData?.numberOfRents}</Typography>
              <Typography>Recently active: {formatDate(userData?.recentlyActive)}</Typography>
              <Typography>Total average weight ratings: {userData?.totalAverageWeightRatings}</Typography>
            </CardContent>
          </Card>
        }
      </Typography>

      <Button variant="contained" color="secondary" onClick={handleDisplayData} sx={{ marginRight: 2 }}>
        Display Data
      </Button>

      <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ marginRight: 2 }}>
        Update Data
      </Button>

      <Button variant="contained" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Container >
  );
};

export default MainPage;
