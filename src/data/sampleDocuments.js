// Pre-configured sample document templates and schemas for instant demonstration

export const SAMPLE_DOCUMENTS = [
  {
    id: "sample-invoice-01",
    name: "Vendor Invoice #INV-2026-894",
    type: "invoice",
    category: "Financial / Billing",
    fileType: "pdf",
    description: "Inconsistent commercial invoice with line items, tax breakdown, and vendor banking metadata.",
    previewText: `
ACME Industrial Solutions Inc.
100 Innovation Way, Suite 400
Austin, TX 78701
Tax ID: 84-1928374 | Tel: (512) 555-0199

INVOICE
Invoice No: INV-2026-894
Date: September 28, 2026
Due Date: October 28, 2026
PO Number: PO-88231

BILL TO:
Apex Global Technologies
450 Enterprise Blvd
San Jose, CA 95134
Attn: Accounts Payable (ap@apexglobal.io)

ITEM DESCRIPTION                    QTY    UNIT PRICE     TOTAL
-----------------------------------------------------------------
Enterprise Cloud AI Gateway Node     2     $2,450.00     $4,900.00
Custom Form Parsing Model Tuning     1     $1,200.00     $1,200.00
SLA Priority Support (Q4 2026)      1     $ 850.00      $ 850.00
-----------------------------------------------------------------
SUBTOTAL:                                               $6,950.00
Tax Rate: 8.25%                                         $  573.38
Shipping & Handling:                                    $  125.00
DISCOUNT (PROMO-2026):                                 -$  250.00
-----------------------------------------------------------------
TOTAL BALANCE DUE:                                      $7,398.38

Payment Method: ACH Direct Transfer
Bank Name: First National Tech Bank
Routing Number: 121000358
Account Number: ****4892
Note: Please reference INV-2026-894 on all wire transfers.
`,
    schema: {
      type: "object",
      required: ["invoiceNumber", "invoiceDate", "vendorName", "totalAmount", "lineItems"],
      properties: {
        invoiceNumber: { type: "string", description: "Unique invoice identifier" },
        invoiceDate: { type: "string", format: "date", description: "Date of issue" },
        dueDate: { type: "string", format: "date", description: "Payment due date" },
        poNumber: { type: "string", description: "Purchase Order number" },
        vendorName: { type: "string", description: "Name of vendor/issuer" },
        vendorTaxId: { type: "string", description: "Vendor EIN or Tax ID" },
        customerName: { type: "string", description: "Bill to entity name" },
        customerEmail: { type: "string", format: "email", description: "Billing contact email" },
        subtotal: { type: "number", description: "Subtotal before tax" },
        taxAmount: { type: "number", description: "Calculated tax" },
        discountAmount: { type: "number", description: "Discount applied" },
        totalAmount: { type: "number", description: "Final balance due in USD" },
        lineItems: {
          type: "array",
          items: {
            type: "object",
            required: ["description", "quantity", "unitPrice", "totalPrice"],
            properties: {
              description: { type: "string" },
              quantity: { type: "number" },
              unitPrice: { type: "number" },
              totalPrice: { type: "number" }
            }
          }
        },
        paymentMethod: { type: "string", description: "Preferred payment mechanism" }
      }
    },
    mockExtraction: {
      invoiceNumber: "INV-2026-894",
      invoiceDate: "2026-09-28",
      dueDate: "2026-10-28",
      poNumber: "PO-88231",
      vendorName: "ACME Industrial Solutions Inc.",
      vendorTaxId: "84-1928374",
      customerName: "Apex Global Technologies",
      customerEmail: "ap@apexglobal.io",
      subtotal: 6950.00,
      taxAmount: 573.38,
      discountAmount: 250.00,
      totalAmount: 7398.38,
      lineItems: [
        { description: "Enterprise Cloud AI Gateway Node", quantity: 2, unitPrice: 2450.00, totalPrice: 4900.00 },
        { description: "Custom Form Parsing Model Tuning", quantity: 1, unitPrice: 1200.00, totalPrice: 1200.00 },
        { description: "SLA Priority Support (Q4 2026)", quantity: 1, unitPrice: 850.00, totalPrice: 850.00 }
      ],
      paymentMethod: "ACH Direct Transfer"
    },
    confidenceScores: {
      invoiceNumber: 0.99,
      invoiceDate: 0.98,
      dueDate: 0.97,
      vendorName: 0.99,
      totalAmount: 0.99,
      lineItems: 0.95
    }
  },
  {
    id: "sample-medical-02",
    name: "Patient Intake & Health Questionnaire",
    type: "medical",
    category: "Healthcare",
    fileType: "image",
    description: "Hand-filled medical intake form with patient demographics, allergies, medical history, and emergency contacts.",
    previewText: `
METRO HEALTHCARE SYSTEMS - PATIENT INTAKE FORM
Date of Visit: 2026-09-30
Facility: St. Jude Medical Plaza

1. PATIENT DEMOGRAPHICS:
Full Name: Sarah Elizabeth Jenkins
DOB: 1988-04-14 | Gender: Female
Phone: (415) 892-3041 | Email: s.jenkins@email.org
Address: 742 Evergreen Terrace, San Francisco, CA 94110
Insurance Provider: BlueShield Premier
Policy / Member ID: BSP-99481203

2. CHIEF COMPLAINT & SYMPTOMS:
Primary Concern: Recurrent migraine headaches with aura for past 3 weeks
Severity (1-10): 7/10
Onset Date: September 10, 2026

3. MEDICAL HISTORY & ALLERGIES:
Known Allergies: Penicillin (Severe rash), Peanut Oil (Anaphylaxis)
Current Medications: Lisinopril 10mg daily, Vitamin D3 2000IU
Past Surgeries: Appendectomy (2018)

4. EMERGENCY CONTACT:
Contact Name: Robert Jenkins (Spouse)
Phone: (415) 892-3049
Relationship: Husband
`,
    schema: {
      type: "object",
      required: ["patientName", "dob", "primarySymptom", "allergies", "insuranceProvider"],
      properties: {
        patientName: { type: "string", description: "Patient's full legal name" },
        dob: { type: "string", format: "date", description: "Date of birth" },
        gender: { type: "string", enum: ["Male", "Female", "Other", "Prefer not to say"] },
        phone: { type: "string" },
        email: { type: "string", format: "email" },
        address: { type: "string" },
        insuranceProvider: { type: "string" },
        policyId: { type: "string" },
        primarySymptom: { type: "string" },
        symptomSeverity: { type: "number", description: "Pain or severity score 1-10" },
        onsetDate: { type: "string", format: "date" },
        allergies: {
          type: "array",
          items: { type: "string" },
          description: "List of known patient allergies"
        },
        currentMedications: {
          type: "array",
          items: { type: "string" }
        },
        emergencyContact: {
          type: "object",
          properties: {
            name: { type: "string" },
            phone: { type: "string" },
            relationship: { type: "string" }
          }
        }
      }
    },
    mockExtraction: {
      patientName: "Sarah Elizabeth Jenkins",
      dob: "1988-04-14",
      gender: "Female",
      phone: "(415) 892-3041",
      email: "s.jenkins@email.org",
      address: "742 Evergreen Terrace, San Francisco, CA 94110",
      insuranceProvider: "BlueShield Premier",
      policyId: "BSP-99481203",
      primarySymptom: "Recurrent migraine headaches with aura for past 3 weeks",
      symptomSeverity: 7,
      onsetDate: "2026-09-10",
      allergies: ["Penicillin (Severe rash)", "Peanut Oil (Anaphylaxis)"],
      currentMedications: ["Lisinopril 10mg daily", "Vitamin D3 2000IU"],
      emergencyContact: {
        name: "Robert Jenkins",
        phone: "(415) 892-3049",
        relationship: "Husband"
      }
    },
    confidenceScores: {
      patientName: 0.99,
      dob: 0.99,
      primarySymptom: 0.96,
      allergies: 0.94,
      insuranceProvider: 0.98
    }
  },
  {
    id: "sample-job-03",
    name: "Senior Software Engineer Application",
    type: "job_application",
    category: "HR / Recruitment",
    fileType: "pdf",
    description: "Standard job application form with candidate background, work experience, desired compensation, and authorization.",
    previewText: `
GLOBAL TECH DYNAMICS INC. - JOB APPLICATION FORM

POSITION APPLIED FOR: Senior Staff AI/ML Engineer (Requisition #REQ-4091)
APPLICANT INFORMATION:
Full Name: Marcus Aurelius Vance
Email: marcus.vance@techdev.net | Phone: +1 (650) 419-8821
LinkedIn: linkedin.com/in/marcusvance-ai
Current Location: Seattle, WA (Willing to Relocate: Yes)

WORK AUTHORIZATION:
Legally Authorized to Work in US: Yes
Requires Sponsorship: No (US Citizen)

EXPERIENCE & SKILLS:
Years of Professional Experience: 8.5
Current Employer: CloudScale Technologies (Role: Lead ML Systems Engineer)
Expected Base Salary: $210,000 / year
Earliest Start Date: November 15, 2026

CORE COMPETENCIES:
- Python, TypeScript, C++, PyTorch, CUDA
- Large Language Models (LLMs), RAG, Fine-tuning, Structured Output Parsing
- Kubernetes, Docker, AWS EC2 / ECS, Distributed Systems

REFERENCES:
1. Dr. Elena Rostova - VP of AI Engineering, CloudScale (elena@cloudscale.io)
2. David Miller - Principal Architect, Horizon Software (dmiller@horizon.org)
`,
    schema: {
      type: "object",
      required: ["applicantName", "email", "positionApplied", "yearsExperience", "skills"],
      properties: {
        applicantName: { type: "string" },
        email: { type: "string", format: "email" },
        phone: { type: "string" },
        linkedIn: { type: "string" },
        currentLocation: { type: "string" },
        willingToRelocate: { type: "boolean" },
        positionApplied: { type: "string" },
        reqNumber: { type: "string" },
        authorizedInUS: { type: "boolean" },
        requiresSponsorship: { type: "boolean" },
        yearsExperience: { type: "number" },
        currentEmployer: { type: "string" },
        currentRole: { type: "string" },
        expectedSalaryUSD: { type: "number" },
        earliestStartDate: { type: "string", format: "date" },
        skills: {
          type: "array",
          items: { type: "string" }
        }
      }
    },
    mockExtraction: {
      applicantName: "Marcus Aurelius Vance",
      email: "marcus.vance@techdev.net",
      phone: "+1 (650) 419-8821",
      linkedIn: "linkedin.com/in/marcusvance-ai",
      currentLocation: "Seattle, WA",
      willingToRelocate: true,
      positionApplied: "Senior Staff AI/ML Engineer",
      reqNumber: "REQ-4091",
      authorizedInUS: true,
      requiresSponsorship: false,
      yearsExperience: 8.5,
      currentEmployer: "CloudScale Technologies",
      currentRole: "Lead ML Systems Engineer",
      expectedSalaryUSD: 210000,
      earliestStartDate: "2026-11-15",
      skills: ["Python", "TypeScript", "C++", "PyTorch", "CUDA", "LLMs", "RAG", "Fine-tuning", "Structured Output Parsing", "Kubernetes", "Docker", "AWS EC2 / ECS", "Distributed Systems"]
    },
    confidenceScores: {
      applicantName: 0.99,
      email: 0.99,
      positionApplied: 0.98,
      yearsExperience: 0.97,
      skills: 0.95
    }
  },
  {
    id: "sample-tax-w9-04",
    name: "W-9 Taxpayer Identification Form",
    type: "tax_form",
    category: "Government / Legal",
    fileType: "pdf",
    description: "IRS Form W-9 for request for Taxpayer Identification Number and Certification.",
    previewText: `
Form W-9 (Rev. March 2024) - Department of the Treasury Internal Revenue Service
REQUEST FOR TAXPAYER IDENTIFICATION NUMBER AND CERTIFICATION

1. Name (as shown on your income tax return): Quantum Systems Consulting LLC
2. Business name/disregarded entity name: Quantum AI Solutions
3. Check appropriate box for federal tax classification:
   [ ] Individual/sole proprietor  [X] C Corporation  [ ] S Corporation  [ ] Partnership
4. Exemptions: Exempt payee code (if any): 1 | Exemption from FATCA reporting code: A
5. Address: 1200 Enterprise Parkway, Suite 900
6. City, state, and ZIP code: Austin, TX 78759

PART I - TAXPAYER IDENTIFICATION NUMBER (TIN)
Employer Identification Number (EIN): 47-9283710

PART II - CERTIFICATION
Under penalties of perjury, I certify that:
1. The number shown on this form is my correct taxpayer identification number.
2. I am not subject to backup withholding.
Signed: Jonathan Sterling | Title: Chief Executive Officer | Date: 2026-08-15
`,
    schema: {
      type: "object",
      required: ["entityName", "taxClassification", "ein", "signatureDate"],
      properties: {
        entityName: { type: "string" },
        businessDbaName: { type: "string" },
        taxClassification: { type: "string", enum: ["Individual/sole proprietor", "C Corporation", "S Corporation", "Partnership", "Trust/estate", "LLC"] },
        exemptPayeeCode: { type: "string" },
        address: { type: "string" },
        cityStateZip: { type: "string" },
        ein: { type: "string", description: "Employer Identification Number" },
        ssn: { type: "string", description: "Social Security Number (if individual)" },
        signatoryName: { type: "string" },
        signatoryTitle: { type: "string" },
        signatureDate: { type: "string", format: "date" }
      }
    },
    mockExtraction: {
      entityName: "Quantum Systems Consulting LLC",
      businessDbaName: "Quantum AI Solutions",
      taxClassification: "C Corporation",
      exemptPayeeCode: "1",
      address: "1200 Enterprise Parkway, Suite 900",
      cityStateZip: "Austin, TX 78759",
      ein: "47-9283710",
      signatoryName: "Jonathan Sterling",
      signatoryTitle: "Chief Executive Officer",
      signatureDate: "2026-08-15"
    },
    confidenceScores: {
      entityName: 0.99,
      taxClassification: 0.98,
      ein: 0.99,
      signatureDate: 0.97
    }
  }
];
