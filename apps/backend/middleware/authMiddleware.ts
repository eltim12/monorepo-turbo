import { Response, NextFunction } from "express";
import admin from "../config/firebaseConfig";
import { AuthenticatedRequest } from "../types/express";

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return; // Explicitly return void
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    // Verify Firebase token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken || !decodedToken.uid) {
      res.status(403).json({ error: "Forbidden: Invalid token" });
      return; // Explicitly return void
    }

    // Attach user info to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    res.status(403).json({ error: "Forbidden: Invalid or expired token" });
    return; // Explicitly return void
  }
};
