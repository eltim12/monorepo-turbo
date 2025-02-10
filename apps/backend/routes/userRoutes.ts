import express from "express";
import { UserController } from "../controller/api";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/fetch-user-data", authMiddleware, UserController.fetchUserData);
router.put("/update-user-data", authMiddleware, UserController.updateUserData);
router.get("/fetch-potential-user-data", UserController.fetchPotentialUserData)

export default router;


