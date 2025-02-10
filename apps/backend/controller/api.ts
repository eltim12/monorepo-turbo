import { Request, Response } from "express";
import { UserRepository } from "../repository/userCollection";
import { AuthenticatedRequest } from "../types/express";

import admin from "../config/firebaseConfig";
const db = admin.firestore();
export class UserController {
  static async fetchUserData(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;

    try {
      if (!authReq.user || !authReq.user.uid) {
        res.status(401).json({ error: "Unauthorized: Missing user data" });
        return 
      }

      const userId = authReq.user.uid;
      const userData = await UserRepository.fetchUserData(userId);

      if (!userData) {
        res.status(404).json({ error: "User not found" });
        return 
      }

      res.json(userData);
      return
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return
    }
  }

  static async updateUserData(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;

    try {
      if (!authReq.user || !authReq.user.uid) {
        res.status(401).json({ error: "Unauthorized: Missing user data" });
        return
      }

      const userId = authReq.user.uid;
      const userData = authReq.body;

      await UserRepository.updateUserData(userId, userData);
      res.json({ message: "User data updated successfully" });
      return
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return
    }
  }

  static async fetchPotentialUserData(req: Request, res: Response) {
    try {
      const lastDocId = (req.query.lastDocId as string) || "";
      const pageSize = req.query.pageSize ? String(req.query.pageSize) : "10";
  
      const potentialUserData = await UserRepository.fetchPotentialUserData(lastDocId, pageSize);
      res.json(potentialUserData);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }  
}
