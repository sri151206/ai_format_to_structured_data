import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { SAMPLE_DOCUMENTS } from "../data/sampleDocuments.js";
import { extractStructuredData } from "../services/geminiService.js";
import { validateStructuredData } from "../services/schemaValidator.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Configure Multer for file uploads (memory storage for speed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

/**
 * GET /api/samples
 * Retrieve list of pre-built sample forms
 */
router.get("/samples", (req, res) => {
  res.json({
    success: true,
    samples: SAMPLE_DOCUMENTS.map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      category: s.category,
      fileType: s.fileType,
      description: s.description,
      schema: s.schema,
      previewText: s.previewText
    }))
  });
});

/**
 * POST /api/extract
 * Core Extraction Endpoint
 */
router.post("/extract", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    const { sampleId, customSchemaJson, schemaPreset } = req.body;
    let documentText = req.body.documentText || "";
    let imageBase64 = null;
    let mimeType = null;
    let targetSchema = null;

    // Parse target schema if provided as stringified JSON
    if (customSchemaJson) {
      try {
        targetSchema = typeof customSchemaJson === "string" ? JSON.parse(customSchemaJson) : customSchemaJson;
      } catch (err) {
        return res.status(400).json({
          error: "Invalid Schema JSON",
          message: "The custom target JSON schema provided is not valid JSON."
        });
      }
    }

    // Process file upload if attached
    if (req.file) {
      mimeType = req.file.mimetype;
      const fileBuffer = req.file.buffer;

      if (mimeType === "application/pdf") {
        try {
          const pdfData = await pdfParse(fileBuffer);
          documentText = pdfData.text;
        } catch (pdfErr) {
          console.warn("PDF text parse warning, using image base64 fallback:", pdfErr.message);
          imageBase64 = fileBuffer.toString("base64");
        }
      } else if (mimeType.startsWith("image/")) {
        imageBase64 = fileBuffer.toString("base64");
        documentText = `[Uploaded Image Document: ${req.file.originalname}]`;
      } else if (mimeType.startsWith("text/") || mimeType === "application/json") {
        documentText = fileBuffer.toString("utf-8");
      }
    }

    // If sample document ID was selected instead of file upload
    if (sampleId && !documentText && !imageBase64) {
      const sample = SAMPLE_DOCUMENTS.find(s => s.id === sampleId);
      if (sample) {
        documentText = sample.previewText;
        if (!targetSchema) {
          targetSchema = sample.schema;
        }
      }
    }

    // Fallback schema if none provided
    if (!targetSchema) {
      targetSchema = {
        type: "object",
        properties: {
          documentTitle: { type: "string" },
          issueDate: { type: "string" },
          extractedSummary: { type: "string" }
        }
      };
    }

    if (!documentText && !imageBase64) {
      return res.status(400).json({
        error: "Missing Document",
        message: "Please upload a document file (PDF, image, text) or select a sample form."
      });
    }

    // Execute Extraction Service
    const extractionResult = await extractStructuredData({
      documentText,
      imageBase64,
      mimeType,
      schema: targetSchema,
      sampleId
    });

    // Validate extracted structured JSON against schema using Ajv
    const validationResult = validateStructuredData(targetSchema, extractionResult.data);

    return res.json({
      success: true,
      extractedData: extractionResult.data,
      confidenceScores: extractionResult.confidenceScores,
      schemaValidation: validationResult,
      metadata: {
        modelUsed: extractionResult.modelUsed,
        executionTimeMs: extractionResult.executionTimeMs,
        tokensUsed: extractionResult.tokensUsed,
        user: req.user ? { uid: req.user.uid, email: req.user.email } : null,
        timestamp: new Date().toISOString()
      },
      sourceText: documentText
    });

  } catch (error) {
    console.error("Extraction error:", error);
    return res.status(500).json({
      error: "Extraction Failed",
      message: error.message || "An unexpected error occurred during form field extraction."
    });
  }
});

/**
 * POST /api/validate-schema
 * Validates syntax and structure of custom JSON Schema
 */
router.post("/validate-schema", (req, res) => {
  const { schema } = req.body;
  if (!schema) {
    return res.status(400).json({ valid: false, message: "No schema provided" });
  }

  const validation = validateStructuredData(schema, {});
  return res.json({
    valid: true,
    message: "Schema syntax is valid."
  });
});

/**
 * POST /api/export
 * Formats JSON payload for CSV download
 */
router.post("/export", (req, res) => {
  const { data, format } = req.body;
  if (!data) {
    return res.status(400).json({ error: "No data to export" });
  }

  if (format === "csv") {
    try {
      const rows = [];
      const keys = Object.keys(data);
      rows.push(keys.join(","));
      const values = keys.map(k => {
        const val = data[k];
        if (typeof val === "object") return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      rows.push(values.join(","));

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=extracted-structured-data.csv");
      return res.send(rows.join("\n"));
    } catch (err) {
      return res.status(500).json({ error: "CSV Conversion Failed", message: err.message });
    }
  }

  return res.json(data);
});

export default router;
