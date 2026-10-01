import admin from "firebase-admin";

let firebaseAdminApp = null;
let isFirebaseConfigured = false;

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : process.env.FIREBASE_PROJECT_ID
    ? {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      }
    : null;

  if (serviceAccount && serviceAccount.projectId) {
    firebaseAdminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isFirebaseConfigured = true;
    console.log("✅ Firebase Admin SDK initialized successfully.");
  } else {
    console.log("ℹ️ Firebase Admin credentials not provided in env. Running in Demo / Open Auth mode.");
  }
} catch (error) {
  console.warn("⚠️ Firebase Admin SDK initialization warning:", error.message);
}

export { firebaseAdminApp, isFirebaseConfigured };
