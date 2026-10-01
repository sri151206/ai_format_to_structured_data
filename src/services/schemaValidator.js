import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, verbose: true, strict: false });
addFormats(ajv);

/**
 * Validates extracted data against a target JSON Schema
 * @param {object} schema - JSON Schema object
 * @param {object} data - Extracted structured JSON data
 * @returns {object} Validation result containing isValid, errors, complianceScore, and formattedReport
 */
export function validateStructuredData(schema, data) {
  if (!schema || typeof schema !== "object") {
    return {
      isValid: true,
      errors: [],
      complianceScore: 100,
      formattedReport: "No JSON Schema provided for validation."
    };
  }

  try {
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    if (isValid) {
      return {
        isValid: true,
        errors: [],
        complianceScore: 100,
        formattedReport: "✅ Perfect Match: Structured output complies 100% with target JSON Schema."
      };
    }

    const formattedErrors = (validate.errors || []).map(err => {
      const fieldPath = err.instancePath ? err.instancePath.replace(/^\//, "").replace(/\//g, ".") : "(root)";
      return {
        field: fieldPath,
        keyword: err.keyword,
        message: err.message,
        params: err.params,
        schemaPath: err.schemaPath
      };
    });

    // Calculate compliance score based on required fields vs errors
    const totalProperties = schema.properties ? Object.keys(schema.properties).length : 1;
    const errorCount = formattedErrors.length;
    const score = Math.max(0, Math.round(((totalProperties - Math.min(errorCount, totalProperties)) / totalProperties) * 100));

    return {
      isValid: false,
      errors: formattedErrors,
      complianceScore: score,
      formattedReport: `⚠️ Schema Validation Alert: Found ${errorCount} schema violation(s).`
    };
  } catch (error) {
    console.error("Schema compilation error:", error.message);
    return {
      isValid: false,
      errors: [{ field: "schema", keyword: "compilation", message: error.message }],
      complianceScore: 0,
      formattedReport: `❌ Invalid JSON Schema Definition: ${error.message}`
    };
  }
}
