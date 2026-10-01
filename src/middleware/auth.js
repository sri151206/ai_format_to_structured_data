import admin from "firebase-admin";
import { isFirebaseConfigured } from "../config/firebase.js";

/**
 * Authentication Middleware
 * Validates Firebase ID tokens passed in Authorization header: Bearer <token>
 * If Firebase is not configured or request comes with Demo token, assigns demo user.
 */
export async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Attach default guest/demo user context
    req.user = {
      uid: "guest-demo-user",
      email: "demo.user@docustruct.ai",
      name: "Demo Guest User",
      provider: "demo",
      isAnonymous: true
    };
    return next();
  }

  const token = authHeader.split("Bearer ")[1];

  if (token === "demo-token" || !isFirebaseConfigured) {
    req.user = {
      uid: "authenticated-demo-user",
      email: "authenticated.user@docustruct.ai",
      name: "Authenticated Demo User",
      provider: "google.com",
      isAnonymous: false
    };
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || decodedToken.email || "User",
      picture: decodedToken.picture || "",
      provider: decodedToken.firebase?.sign_in_provider || "firebase",
      isAnonymous: false
    };
    next();
  } catch (error) {
    console.error("Firebase token verification error:", error.message);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired authentication token. Please sign in again.",
      details: error.message
    });
  }
}
