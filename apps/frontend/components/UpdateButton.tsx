"use client";
import { useSelector } from "react-redux";
import { fetchUserData } from "@/apis/userApi";
import { RootState } from "@/store/store";
import { Button } from "@mui/material";

export default function UpdateButton() {

  // Corrected Redux state path
  const user = useSelector((state: RootState) => state.auth.user);

  const handleFetch = async () => {
    if (user) {
      const token = await user.getIdToken();
      const response = await fetchUserData(token);
    } else {
      console.log("No user is logged in.");
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleFetch}>Fetch User Data</Button>
    </div>
  );
}
