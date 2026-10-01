import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import extractRoutes from "./routes/extractRoutes.js";
import { isFirebaseConfigured } from "./config/firebase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Request Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api", extractRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const isGeminiConfigured = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY");
  res.json({
    status: "healthy",
    appName: "DocuStruct AI Form Extractor Server",
    version: "1.0.0",
    firebaseAuth: isFirebaseConfigured ? "configured" : "demo_mode",
    geminiAi: isGeminiConfigured ? "configured" : "demo_mode",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected server error occurred."
  });
});

app.listen(PORT, () => {
  console.log(`
🚀 DocuStruct AI Server running on http://localhost:${PORT}
- Firebase Auth Status: ${isFirebaseConfigured ? "Active" : "Demo Mode"}
- Gemini AI Engine: ${process.env.GEMINI_API_KEY ? "Connected" : "Rule Engine Fallback"}
  `);
});
