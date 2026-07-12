import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Agent, setGlobalDispatcher } from "undici";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { appendLead, appendAnalytics, getStats, appendFeedback } from "../src/lib/sheets.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret-change-in-prod";

// Standard Node 18+ global fetch timeout increase to prevent HeadersTimeoutError (5xx/503 errors) during long legal analyses
setGlobalDispatcher(
  new Agent({
    headersTimeout: 300000, // 5 minutes
    bodyTimeout: 300000,    // 5 minutes
    connectTimeout: 60000,  // 1 minute
  })
);

const app = express();
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT) || 3000;

// In-memory job store for async contract analysis (avoids Back4app's gateway
// proxy timeout, which is shorter than a full Gemini contract analysis can take).
// NOTE: this is per-instance. If this service ever scales to multiple instances,
// this needs to move to Firestore/Redis, same as was done for the OTP store.
type AnalysisJob = {
  status: "pending" | "done" | "error";
  result?: any;
  error?: string;
  createdAt: number;
};
const analysisJobs = new Map<string, AnalysisJob>();

// Clean up jobs older than 30 minutes so the map doesn't grow forever
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [id, job] of analysisJobs.entries()) {
    if (job.createdAt < cutoff) analysisJobs.delete(id);
  }
}, 5 * 60 * 1000);

// Body parsers
app.use(express.json({ limit: "15mb" }));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    process.env.APP_URL,
    'http://localhost:3000',
    'http://localhost:5173'
  ].filter(Boolean) as string[];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Extremely robust in-memory rate limiter
const ipRequests = new Map<string, { count: number; resetTime: number }>();
function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const ipStr = Array.isArray(ip) ? ip[0] : ip;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const limit = 10;

  let client = ipRequests.get(ipStr);
  if (!client || now > client.resetTime) {
    client = { count: 1, resetTime: now + windowMs };
    ipRequests.set(ipStr, client);
    return next();
  }

  if (client.count >= limit) {
    return res.status(429).json({
      error: "Too many requests. Limit is 10 contract analyses or chats per hour. / 每小时限制为 10 次分析或提问。",
    });
  }

  client.count++;
  next();
}

// Clean up old rate limit maps periodically to avoid leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequests.entries()) {
    if (now > data.resetTime) {
      ipRequests.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Helper for repairing truncated JSON strings/structures elegantly
function repairTruncatedJson(str: string): string {
  let inString = false;
  let escapeNext = false;
  const stack: string[] = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === "\\") {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === "{") {
        stack.push("{");
      } else if (char === "[") {
        stack.push("[");
      } else if (char === "}") {
        if (stack[stack.length - 1] === "{") {
          stack.pop();
        }
      } else if (char === "]") {
        if (stack[stack.length - 1] === "[") {
          stack.pop();
        }
      }
    }
  }

  let repaired = str;
  if (inString) {
    if (repaired.endsWith("\\")) {
      repaired = repaired.slice(0, -1);
    }
    repaired += '"';
  }

  repaired = repaired.trim();
  
  let beforeClose = repaired;
  while (beforeClose.length > 0) {
    const lastChar = beforeClose[beforeClose.length - 1];
    if (lastChar === "," || lastChar === ":" || lastChar === " ") {
      beforeClose = beforeClose.slice(0, -1).trim();
    } else {
      break;
    }
  }
  repaired = beforeClose;

  while (stack.length > 0) {
    const open = stack.pop();
    if (open === "{") {
      repaired += "}";
    } else if (open === "[") {
      repaired += "]";
    }
  }

  return repaired;
}

// Helper for parsing JSON safely (with fallback / formatting cleanup)
const safeJsonParse = (str: string) => {
  let cleaned = str.trim();
  // Remove markdown wraps
  cleaned = cleaned.replace(/^```json\s*/ig, "").replace(/\s*```$/g, "").trim();

  // Escape literal unescaped control characters inside string literals
  let inString = false;
  let escapeNext = false;
  const chars: string[] = [];
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (escapeNext) {
      chars.push(char);
      escapeNext = false;
      continue;
    }
    if (char === "\\") {
      chars.push(char);
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      if (!inString) {
        // Opening a string
        inString = true;
        chars.push(char);
        continue;
      }
      // We're inside a string — check if this quote is a REAL closer
      // by looking ahead past whitespace for a JSON structural character
      let j = i + 1;
      while (j < cleaned.length && /\s/.test(cleaned[j])) j++;
      const nextChar = cleaned[j];
      const isRealCloser = nextChar === ',' || nextChar === '}' || nextChar === ']' || nextChar === ':' || j >= cleaned.length;
      if (isRealCloser) {
        inString = false;
        chars.push(char);
      } else {
        // Stray quote inside string content — escape it instead of closing
        chars.push('\\"');
      }
      continue;
    }
    if (inString) {
      if (char === "\n") {
        chars.push("\\n");
      } else if (char === "\r") {
        chars.push("\\r");
      } else if (char === "\t") {
        chars.push("\\t");
      } else {
        chars.push(char);
      }
    } else {
      chars.push(char);
    }
  }
  cleaned = chars.join("");
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(cleaned);
  } catch (originalError) {
    console.warn("JSON.parse failed on cleaned text. Attempting self-healing/repair logic...", originalError);
    try {
      const repaired = repairTruncatedJson(cleaned);
      return JSON.parse(repaired);
    } catch (repairError) {
      console.error("Self-healing JSON repair failed:", repairError);
      throw new Error("Failed to parse legal analysis output. Please try again.");
    }
  }
};

function looksLikeContract(text: string): boolean {
  const lower = text.toLowerCase();

  // Strong contract-structure signals (clauses/articles/parties language)
  const contractKeywords = [
    'pasal', 'perjanjian', 'kontrak', 'pihak pertama', 'pihak kedua',
    'pihak ke-1', 'pihak ke-2', 'menyetujui', 'menyatakan sepakat',
    '合同', '协议', '甲方', '乙方', '条款', '违约', '签署',
    'agreement', 'contract', 'party of the first part', 'party of the second part',
    'whereas', 'hereby agree', 'terms and conditions', 'governing law',
    'jurisdiction', 'termination clause', 'force majeure'
  ];

  // Invoice/PO/packing-list signals — presence of these WITHOUT contract
  // signals should disqualify the document, since CRA only analyzes contracts.
  const invoiceOnlyKeywords = [
    'invoice number', 'invoice no', 'faktur nomor', 'no. faktur', 'bill to',
    'ship to', 'packing list', 'purchase order no', 'po number',
    '发票号', '装箱单', '采购订单号', 'quantity', 'unit price', 'subtotal',
    'tax invoice', 'commercial invoice'
  ];

  const contractHits = contractKeywords.filter(kw => lower.includes(kw)).length;
  const invoiceHits = invoiceOnlyKeywords.filter(kw => lower.includes(kw)).length;

  // Require real contract-structure evidence, and reject documents that
  // look primarily like an invoice/PO/packing list even if a stray
  // contract-ish word appears somewhere in them.
  if (invoiceHits >= 2 && contractHits < 2) return false;
  return contractHits >= 2;
}

function logEvent(event: string, meta: { ip?: string; email?: string; contract_type?: string; risk_level?: string; [key: string]: any } = {}) {
  const email = meta.email || "";
  const contractType = meta.contract_type || "";
  const riskLevel = meta.risk_level || "";
  
  // Call Google Sheets appendAnalytics (best effort, handled internally with try-catch)
  appendAnalytics(event, email, contractType, riskLevel);
}

// Nodemailer transporter setup for Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// In-memory OTP store
const otpStore = new Map<string, { code: string; expiresAt: number; verified: boolean }>();

// In-memory OTP email rate limit (max 3 OTP requests per email per hour)
const otpRequests = new Map<string, { count: number; resetTime: number }>();

// Clean up old OTP rate limit and OTP store periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpRequests.entries()) {
    if (now > data.resetTime) {
      otpRequests.delete(email);
    }
  }
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt && !data.verified) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

// Helper with exponential backoff retry to handle transient 503/UNAVAILABLE errors
async function callGeminiWithRetry(params: any, retries = 4, delayMs = 1500) {
  let attempt = 0;
  const originalModel = params.model;
  // Fallback chain of robust text models if gemini-3.5-flash is unavailable
  const backupModels = ["gemini-3.1-flash-lite"];
  
  while (attempt < retries) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      attempt++;
      console.warn(`Gemini API attempt ${attempt} failed with model ${params.model}:`, err?.message || err);
      
      const errMsg = String(err?.message || err || "").toLowerCase();
      const isUnavailable = 
        err?.status === "UNAVAILABLE" || 
        err?.code === 500 || 
        err?.code === 503 || 
        err?.statusCode === 503 ||
        errMsg.includes("503") || 
        errMsg.includes("unavailable") || 
        errMsg.includes("high demand") || 
        errMsg.includes("spikes in demand") ||
        errMsg.includes("temporary") ||
        errMsg.includes("overloaded") ||
        errMsg.includes("rate limit") ||
        errMsg.includes("internal error");

      if (isUnavailable && attempt < retries) {
        // Fall back to next model in the backup list if eligible
        if (backupModels.length > 0) {
          const nextModel = backupModels.shift();
          if (nextModel) {
            console.warn(`Falling back from ${params.model} to ${nextModel}`);
            params.model = nextModel;
          }
        }
        
        const sleepDelay = delayMs * Math.pow(2, attempt - 1);
        console.warn(`Model is unavailable or experiencing high demand. Retrying in ${sleepDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, sleepDelay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("The Gemini model is currently experiencing extremely high demand. Please try again in a few seconds.");
}

// API Route: Send OTP Verification Code
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email wajib diisi. / Email is required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: "Format email tidak valid. / Invalid email format." });
  }

  // Rate Limit: max 3 OTP requests per email per hour
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  let client = otpRequests.get(cleanEmail);
  if (client && now < client.resetTime) {
    if (client.count >= 3) {
      return res.status(429).json({ 
        error: "Batas pengiriman kode verifikasi tercapai (maksimal 3 kali per jam). Silakan coba lagi nanti. / OTP limit reached (max 3 per hour)." 
      });
    }
    client.count++;
  } else {
    otpRequests.set(cleanEmail, { count: 1, resetTime: now + windowMs });
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

  // Store in otpStore
  otpStore.set(cleanEmail, { code, expiresAt, verified: false });

  try {
    // Send email using Nodemailer / Gmail SMTP
    await transporter.sendMail({
      from: `"YORA" <${process.env.GMAIL_USER}>`,
      to: cleanEmail,
      subject: `Kode verifikasi YORA: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1A1A1A;">Kode Verifikasi YORA</h2>
          <p style="color: #333;">Masukkan kode berikut untuk melanjutkan:</p>
          <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #E30613; letter-spacing: 4px;">${code}</span>
          </div>
          <p style="color: #777; font-size: 13px;">Kode ini berlaku selama 10 menit. Jika kamu tidak meminta kode ini, abaikan email ini.</p>
        </div>
      `,
    });

    return res.json({ success: true });
  } catch (error: any) {
    console.error("Failed to send OTP email:", error);
    // Decrement the rate limit so they can retry
    if (client) {
      client.count = Math.max(0, client.count - 1);
    }
    return res.status(500).json({ 
      error: "Gagal mengirim email verifikasi. Coba lagi dalam beberapa saat." 
    });
  }
});

// Helper function to verify session token
function verifySessionToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; verifiedAt: number };
    return { email: decoded.email };
  } catch {
    return null;
  }
}

// API Route: Verify OTP Code
app.post("/api/verify-otp", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "Email dan kode verifikasi harus diisi. / Email and code are required." });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanCode = String(code).trim();

  const record = otpStore.get(cleanEmail);
  if (!record) {
    return res.status(400).json({ error: "Kode verifikasi tidak ditemukan. Silakan kirim ulang kode baru. / Verification code not found." });
  }

  if (Date.now() > record.expiresAt) {
    return res.status(400).json({ error: "Kode verifikasi telah kedaluwarsa. Silakan kirim ulang kode baru. / Verification code has expired." });
  }

  if (record.code !== cleanCode) {
    return res.status(400).json({ error: "Kode verifikasi salah. Silakan coba lagi. / Incorrect verification code." });
  }

  // Update verified status in the store
  record.verified = true;
  otpStore.set(cleanEmail, record);

  // Log lead to Google Sheets
  await appendLead(cleanEmail, 'verified');

  // Generate 30-day session token
  const sessionToken = jwt.sign(
    { email: cleanEmail, verifiedAt: Date.now() },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.json({ success: true, verified: true, sessionToken });
});

// API Route: Check Session Token
app.post("/api/check-session", (req, res) => {
  const { sessionToken } = req.body;
  if (!sessionToken) {
    return res.json({ valid: false });
  }

  const decoded = verifySessionToken(sessionToken);
  if (decoded) {
    return res.json({ valid: true, email: decoded.email });
  } else {
    return res.json({ valid: false });
  }
});

// API Route: Analyze Contract
app.post("/api/analyze", rateLimiter, async (req, res) => {
  const { contractText, outputLang, userEmail, sessionToken } = req.body;
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  let finalUserEmail = userEmail;
  let isSessionValid = false;

  if (sessionToken) {
    const decoded = verifySessionToken(sessionToken);
    if (decoded) {
      finalUserEmail = decoded.email;
      isSessionValid = true;
    }
  }

  logEvent("analyze_start", { ip, email: finalUserEmail });

  if (!isSessionValid) {
    if (!userEmail) {
      return res.status(403).json({ error: "Email not verified. Please verify your email first. / Email tidak terverifikasi. Silakan verifikasi email Anda terlebih dahulu." });
    }

    const cleanEmail = String(userEmail).trim().toLowerCase();
    const isVerified = otpStore.get(cleanEmail)?.verified === true;
    if (!isVerified) {
      return res.status(403).json({ error: "Email not verified. Please verify your email first. / Email tidak terverifikasi. Silakan verifikasi email Anda terlebih dahulu." });
    }
    finalUserEmail = cleanEmail;
  }

  try {
    if (!contractText) {
      logEvent("analyze_error", { ip, email: finalUserEmail });
      return res.status(400).json({ error: "No contract text provided." });
    }
    if (contractText.length > 50000) {
      logEvent("analyze_error", { ip, email: finalUserEmail });
      return res.status(400).json({ error: "Contract exceeds the 50,000 character limit. Please upload a shorter contract or split it into sections. / 合同超过 50,000 字符限制。请上传较短的合同或分段上传。" });
    }
    if (!looksLikeContract(contractText)) {
      logEvent("analyze_error", { ip, email: finalUserEmail });
      return res.status(400).json({
        error: "Document does not appear to be a formal contract. YORA currently analyzes contracts only (not invoices, POs, or packing lists). / Dokumen ini bukan kontrak formal. YORA saat ini hanya menganalisis kontrak. / 该文件不像正式合同。YORA目前仅分析合同。"
      });
    }
    if (!apiKey) {
      logEvent("analyze_error", { ip, email: finalUserEmail });
      return res.status(500).json({ error: "Server GEMINI_API_KEY is not configured." });
    }

    // Create the job and respond immediately so we never hold this HTTP
    // request open long enough to hit Back4app's gateway timeout.
    const jobId = crypto.randomUUID();
    analysisJobs.set(jobId, { status: "pending", createdAt: Date.now() });
    res.status(202).json({ jobId });

    // Run the actual Gemini analysis in the background. Nothing below this
    // point can use `res` again — the response has already been sent.
    runContractAnalysis({ contractText, outputLang, jobId, ip, finalUserEmail });
  } catch (error: any) {
    console.error("Analysis Error:", error);
    logEvent("analyze_error", { ip, email: finalUserEmail });
    if (!res.headersSent) {
      res.status(500).json({ error: "An unexpected error occurred. Please try again." });
    }
  }
});

// API Route: Poll for the result of a background analysis job
app.get("/api/analyze/status/:jobId", (req, res) => {
  const job = analysisJobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found or expired." });
  }
  if (job.status === "pending") {
    return res.json({ status: "pending" });
  }
  if (job.status === "error") {
    return res.json({ status: "error", error: job.error });
  }
  return res.json({ status: "done", result: job.result });
});

async function runContractAnalysis({ contractText, outputLang, jobId, ip, finalUserEmail }: {
  contractText: string;
  outputLang: string;
  jobId: string;
  ip: string;
  finalUserEmail: string;
}) {
  try {
    const getLanguageInstruction = (oLang: string) => {
      if (oLang === "en") return "You must respond entirely in English. Every single text value in your JSON output must be written in English. No Chinese characters. No Indonesian words. English only.";
      if (oLang === "cn") return "You must respond entirely in Simplified Mandarin Chinese (简体中文). Every single text value in your JSON output must be written in Simplified Mandarin Chinese. No English. No Indonesian. Chinese only.";
      if (oLang === "id") return "You must respond entirely in Bahasa Indonesia. Every single text value in your JSON output must be written in Bahasa Indonesia. No English. No Chinese characters. Indonesian only.";
      return "You must respond entirely in English.";
    };

    const langInstruction = getLanguageInstruction(outputLang || "cn");

    const systemPrompt = `You are YORA Contract Risk Analyzer, a senior legal expert with 20 years of experience in cross-border China-Indonesia trade law. Your expertise covers KUHPerdata (Indonesian Civil Code), UU Ketenagakerjaan (Labor Law), Civil Code of the PRC, and international arbitration standards.

${langInstruction}

ACT AS A RIGOROUS AUDITOR:
Your goal is to protect the user from "Toxic Clauses" that are common in cross-border deals but extremely dangerous. You must be professional, meticulous, and provide actionable legal engineering.

LEGAL AUDIT PROTOCOLS:
1. MANDATORY LOCAL CITATIONS:
   - For Indonesian context: Always cite specific Pasals from KUHPerdata (e.g., 1266, 1338, 1320).
   - For Chinese context: Cite the Civil Code of the PRC (民法典).
2. TERMINATION & JURISDICTION:
   - Flag "Terminasi Sepihak" (Unilateral Termination) and waiver of Pasal 1266 KUHPerdata.
   - Flag foreign court jurisdiction as HIGH RISK. Recommend SIAC, HKIAC, or BANI arbitration.
3. COMPREHENSIVE COVERAGE:
   - Identify 5-8 risky_clauses.
   - red_flags: Provide 3-5 most critical "Deal Breakers".
   - missing_clauses: Provide 3-5 key missing contract clauses.

STRICT JSON RULES:
1. Respond ONLY with valid JSON. NO markdown preamble or post-text.
2. NO trailing commas.
3. ALL strings must be properly escaped (especially double quotes " and newlines).
4. Use double quotes for all property names and string values.`;

    const detectContractFormat = (text: string): string => {
      if (/^Pasal\s+\d+/im.test(text)) return 'PASAL (Indonesian: "Pasal 1", "Pasal 2")';
      if (/^第[一二三四五六七八九十百零\d]+条/m.test(text)) return 'CHINESE ARTICLES (第一条, 第二条)';
      if (/^Article\s+\d+/im.test(text)) return 'ARTICLE (Article 1, Article 2)';
      if (/^Section\s+\d+/im.test(text)) return 'SECTION (Section 1, Section 2)';
      if (/^Clause\s+\d+/im.test(text)) return 'CLAUSE (Clause 1, Clause 2)';
      if (/^\d+\.\d+/m.test(text)) return 'HIERARCHICAL NUMBERED (1.1, 1.2, 2.1)';
      if (/^[A-Z]\.\s/m.test(text)) return 'LETTERED (A., B., C.)';
      return 'PARAGRAPH (no numbered structure detected)';
    };

    const contractFormat = detectContractFormat(contractText);

    const jsonStructure = `{
      "contract_type": "string (e.g. Kontrak Pengadaan, Distribution Agreement, Employment Contract)",
      "contract_type_en": "string (English name of contract type)",
      "party_a": "string (full legal name of Party A)",
      "party_b": "string (full legal name of Party B)",
      "duration": "string (contract duration or validity period)",
      "summary_mandarin": "string (3-5 sentence executive summary)",
      "conclusion": "string (2-3 sentence final verdict: sign as-is, negotiate, or reject?)",
      "risk_score": 0,
      "risk_level": "string (HIGH / MEDIUM / LOW)",
      "risk_verdict": "string (one punchy sentence verdict)",
      "red_flags": [
        {
          "title_cn": "string (short name of key threat)",
          "original_text": "string (exact verbatim quote from the contract)",
          "translation_cn": "string (translation into output language)",
          "explanation_cn": "string (2-3 sentences: why dangerous)",
          "suggested_fix_cn": "string (ready-to-use alternative wording)",
          "law_reference": "string (e.g. Pasal 1266 KUHPerdata, etc.)"
        }
      ],
      "risky_clauses": [
        {
          "topic_cn": "string",
          "risk_level": "string (HIGH / MEDIUM / LOW)",
          "original_text": "string (quote)",
          "translation_cn": "string",
          "explanation_cn": "string"
        }
      ],
      "missing_clauses": [
        {
          "name_cn": "string",
          "name_id": "string",
          "importance_cn": "string (why absence is dangerous)"
        }
      ],
      "cultural_legal_notes": [
        "string"
      ]
    }`;

    const finalPrompt = `${systemPrompt}

DETECTED CONTRACT FORMAT: ${contractFormat}

YOU MUST FILL ALL FIELDS. Follow this strict priority order when generating JSON:
1. Fill contract_type, party_a, party_b, duration, summary_mandarin, conclusion, risk_score, risk_level, risk_verdict FIRST.
2. Fill red_flags (3-5 absolute deal-breakers, KEEP EACH FIELD UNDER 40 WORDS) SECOND.
3. Fill risky_clauses (5-8 clauses, KEEP EACH FIELD UNDER 40 WORDS) THIRD.
4. Fill missing_clauses FOURTH (3-5 most critical missing items, KEEP EACH FIELD UNDER 30 WORDS).
5. Fill cultural_legal_notes FIFTH — provide exactly 5 items, KEEP EACH UNDER 30 WORDS.

CRITICAL: If you are running low on output budget, finish the CURRENT field cleanly and move to the next required field rather than leaving it incomplete. Never leave a field half-written.

Respond with ONLY raw JSON matching this structure exactly:
${jsonStructure}

CONTRACT TO ANALYZE:
${contractText}`;

    const contractCharCount = contractText.length;
    const outputTokenBudget = contractCharCount < 5000
      ? 10000
      : contractCharCount < 15000
        ? 14000
        : 20000;

    const response = await callGeminiWithRetry({
      model: "gemini-3.5-flash",
      contents: finalPrompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: outputTokenBudget,
      },
    });

    const aiText = response.text;
    if (!aiText) {
      analysisJobs.set(jobId, { status: "error", error: "Empty response from Gemini GenAI model", createdAt: Date.now() });
      return;
    }

    const parsed = safeJsonParse(aiText);

    // Validate the parsed result actually has real, complete content before trusting it
    const hasGarbageFragment = (val: any): boolean => {
      if (typeof val !== 'string') return false;
      const trimmed = val.trim();
      // Catches short truncated fragments like "IND", "Pasal", single words under 10 chars
      // that are suspiciously short for what should be a full sentence/phrase
      return trimmed.length > 0 && trimmed.length < 10 && !/[.!?]$/.test(trimmed);
    };

    const missingClausesBroken = Array.isArray(parsed?.missing_clauses) 
      && parsed.missing_clauses.some((m: any) => 
           hasGarbageFragment(m?.name_id) || hasGarbageFragment(m?.name_cn) || hasGarbageFragment(m?.importance_cn)
         );

    const isUsable = parsed 
      && parsed.contract_type 
      && parsed.risk_score > 0
      && Array.isArray(parsed.risky_clauses) 
      && parsed.risky_clauses.length > 0
      && Array.isArray(parsed.missing_clauses)
      && parsed.missing_clauses.length > 0
      && Array.isArray(parsed.cultural_legal_notes)
      && parsed.cultural_legal_notes.length > 0
      && !missingClausesBroken;

    if (!isUsable) {
      console.error("Parsed JSON looks truncated/incomplete:", {
        risky_clauses_count: parsed?.risky_clauses?.length,
        missing_clauses_count: parsed?.missing_clauses?.length,
        cultural_legal_notes_count: parsed?.cultural_legal_notes?.length,
        missing_clauses_broken: missingClausesBroken,
      });
      logEvent("analyze_error", { ip, email: finalUserEmail });
      analysisJobs.set(jobId, {
        status: "error",
        error: "Analysis was cut off before completing. Please try again — this usually resolves on retry.",
        createdAt: Date.now(),
      });
      return;
    }

    logEvent("analyze_success", { 
      ip, 
      email: finalUserEmail, 
      contract_type: parsed?.contract_type, 
      risk_level: parsed?.risk_level 
    });

    analysisJobs.set(jobId, { status: "done", result: parsed, createdAt: Date.now() });
  } catch (error: any) {
    console.error("Analysis Error:", error);
    logEvent("analyze_error", { ip, email: finalUserEmail });
    const isKnownUserError = typeof error?.message === 'string' && (
      error.message.includes("50,000") ||
      error.message.includes("does not appear to be a contract") ||
      error.message.includes("Failed to parse") ||
      error.message.includes("currently experiencing")
    );
    analysisJobs.set(jobId, {
      status: "error",
      error: isKnownUserError ? error.message : "An unexpected error occurred. Please try again.",
      createdAt: Date.now(),
    });
  }
}

// API Route: Translate Analysis Report
app.post("/api/translate", rateLimiter, async (req, res) => {
  try {
    const { payload, targetLang } = req.body;
    if (!payload) {
      return res.status(400).json({ error: "No translation payload provided." });
    }

    const payloadStr = JSON.stringify(payload);
    if (payloadStr.length > 60000) {
      return res.status(400).json({ error: "Translation payload too large. Please re-analyze with a shorter contract." });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "Server GEMINI_API_KEY is not configured." });
    }

    const targetName = {
      en: 'English',
      cn: 'Simplified Mandarin Chinese (简体中文)',
      id: 'Bahasa Indonesia'
    }[targetLang as 'en' | 'cn' | 'id'] || 'English';

    const prompt = `You are a professional legal translator. 
Translate all values in the provided JSON to ${targetName}.

CRITICAL - OTHER FIELDS:
- Translate ALL fields (summary_mandarin, conclusion, title_cn, explanation_cn, suggested_fix_cn, importance_cn, name_cn, etc.) into ${targetName}.
- DO NOT leave any English or Indonesian text in the final values.

RULES:
1. Return raw JSON only.
2. Arrays must maintain original length.
3. Do not add new top-level keys.
4. Ensure valid JSON format.

JSON PAYLOAD:
${JSON.stringify(payload)}`;

    const response = await callGeminiWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
      },
    });

    const aiText = response.text;
    if (!aiText) {
      return res.status(500).json({ error: "Empty response from Gemini GenAI model" });
    }

    const parsed = safeJsonParse(aiText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Translation Error:", error);
    const isKnownUserError = typeof error?.message === 'string' && (
      error.message.includes("50,000") ||
      error.message.includes("payload too large") ||
      error.message.includes("Failed to parse") ||
      error.message.includes("currently experiencing")
    );
    res.status(500).json({ 
      error: isKnownUserError ? error.message : "An unexpected error occurred. Please try again." 
    });
  }
});

// API Route: Chat Q&A with Contract Context
app.post("/api/chat", rateLimiter, async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const { messageText, contractText, data, outputLang, isDemo, userEmail, sessionToken } = req.body;

  let finalUserEmail = userEmail;
  let isSessionValid = false;

  if (sessionToken) {
    const decoded = verifySessionToken(sessionToken);
    if (decoded) {
      finalUserEmail = decoded.email;
      isSessionValid = true;
    }
  }

  logEvent("chat_message", { ip, email: finalUserEmail });

  if (!isSessionValid) {
    if (!userEmail) {
      return res.status(403).json({ error: "Email not verified. Please verify your email first. / Email tidak terverifikasi. Silakan verifikasi email Anda terlebih dahulu." });
    }

    const cleanEmail = String(userEmail).trim().toLowerCase();
    const isVerified = otpStore.get(cleanEmail)?.verified === true;
    if (!isVerified) {
      return res.status(403).json({ error: "Email not verified. Please verify your email first. / Email tidak terverifikasi. Silakan verifikasi email Anda terlebih dahulu." });
    }
    finalUserEmail = cleanEmail;
  }

  try {
    if (!messageText) {
      return res.status(400).json({ error: "No message text provided." });
    }

    if (contractText && contractText.length > 50000) {
      return res.status(400).json({ error: "Contract text too large for chat context." });
    }

    if (messageText.length > 2000) {
      return res.status(400).json({ error: "Message too long. Maximum 2,000 characters." });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "Server GEMINI_API_KEY is not configured." });
    }

    const prompt = `You are Rui, YORA's AI legal assistant specialized exclusively in contract analysis for China-Indonesia cross-border trade.

STRICT SCOPE RULES:
- You ONLY answer questions about: the analyzed contract, contract law, clauses, legal risks, negotiation advice, Indonesian/Chinese trade law, and business terms.
- If the user asks ANYTHING outside this scope (weather, general knowledge, coding, personal advice, entertainment, etc.), respond with exactly: "${outputLang === 'cn' ? '抱歉，我只能回答与合同和法律相关的问题。请问您对这份合同有什么疑问？' : outputLang === 'id' ? 'Maaf, saya hanya dapat menjawab pertanyaan seputar kontrak dan hukum. Ada yang ingin ditanyakan tentang kontrak ini?' : 'Sorry, I can only answer questions related to contracts and legal matters. Do you have any questions about this contract?'}"
- Never break character. Never pretend to be a general AI assistant.

The user has already analyzed a contract. Answer their questions about it in ${outputLang === 'cn' ? 'Simplified Mandarin (简体中文)' : outputLang === 'id' ? 'Bahasa Indonesia' : 'English'}. 
  
CHAT ENHANCEMENT RULES:
1. After providing renegotiation advice, optionally add a short closing line that empowers the user, such as:
   - "Saran ini berdasarkan praktik komersial standar internasional dan dapat Anda gunakan dalam negosiasi."
   - "您可以将此建议作为谈判的法律依据。"
   - "You can use this suggestion as leverage in your renegotiation discussion."
2. When suggesting changes, briefly mention WHY the new term is fairer (1 sentence max), so the user can defend the suggestion if challenged.
3. If the user's question relates to a specific high-risk clause already flagged in the provided analysis (red_flags), briefly reference that the issue was already identified.
4. Keep responses concise: 3-5 sentences maximum unless the question specifically requires more detail.
5. Always maintain the consultative legal advisor tone, not a generic AI assistant tone.

Cite specific clause content when relevant. Never make up information not in the contract.
${isDemo ? 'You are in demo mode. Use the pre-analyzed demo data.' : ''}

CONTRACT CONTENT:
${contractText || ''}

ANALYSIS RESULT:
${data ? JSON.stringify(data) : '{}'}

USER QUESTION:
${messageText}
`;

    const response = await callGeminiWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 1024,
      },
    });

    res.json({ text: response.text || "I'm sorry, I couldn't generate a response." });
  } catch (error: any) {
    console.error("Chat Error:", error);
    const isKnownUserError = typeof error?.message === 'string' && (
      error.message.includes("50,000") ||
      error.message.includes("too long") ||
      error.message.includes("Failed to parse") ||
      error.message.includes("currently experiencing")
    );
    res.status(500).json({ 
      error: isKnownUserError ? error.message : "An unexpected error occurred. Please try again." 
    });
  }
});

app.post("/api/translate-contract", rateLimiter, async (req, res) => {
  try {
    const { contractText, outputLang } = req.body;
    if (!contractText) {
      return res.status(400).json({ error: "No contract text provided." });
    }
    if (contractText.length > 50000) {
      return res.status(400).json({ error: "Contract too large for translation." });
    }
    if (!apiKey) {
      return res.status(500).json({ error: "Server GEMINI_API_KEY is not configured." });
    }

    const targetName = outputLang === 'cn'
      ? 'Simplified Mandarin Chinese (简体中文)'
      : outputLang === 'id'
        ? 'Bahasa Indonesia'
        : 'English';

    const prompt = `You are a professional legal translator.
Translate the following contract COMPLETELY into ${targetName}.
Preserve the exact structure — every article, clause and sub-clause must appear.

FORMAT RULES (critical):
- Keep article/pasal headers on their own line
- Sub-clauses like 1.1, 1.2 must have the number AND content on the SAME line. Never put "1.1" alone.
- Separate articles with a blank line
- Never write "[Content not available]" or any placeholder
- Never summarize — translate every single word verbatim

Respond with ONLY the translated text. No JSON. No preamble. No explanation.

CONTRACT:
${contractText}`;

    const response = await callGeminiWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 8192,
      },
    });

    res.json({ translation: response.text || "" });
  } catch (error: any) {
    console.error("Contract Translation Error:", error);
    const isKnownUserError = typeof error?.message === 'string' && (
      error.message.includes("50,000") ||
      error.message.includes("too large") ||
      error.message.includes("Failed to parse") ||
      error.message.includes("currently experiencing")
    );
    res.status(500).json({ 
      error: isKnownUserError ? error.message : "An unexpected error occurred. Please try again." 
    });
  }
});

// API Route: Submit Feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const { email, rating, comment, sessionToken } = req.body;
    
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5." });
    }

    let finalEmail = email || "";

    if (sessionToken) {
      const decoded = verifySessionToken(sessionToken);
      if (decoded) {
        finalEmail = decoded.email;
      }
    }

    await appendFeedback(finalEmail, ratingNum, comment || "");

    return res.json({ success: true });
  } catch (error) {
    console.error("Feedback handling error:", error);
    return res.json({ success: true }); // Always return success gracefully
  }
});

// API Route: Admin Stats Protected by secret x-admin-key header
app.get("/api/admin/stats", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  const expectedKey = process.env.ADMIN_STATS_KEY;
  if (!expectedKey || adminKey !== expectedKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const stats = await getStats();
    return res.json(stats);
  } catch (error: any) {
    console.error("Stats reading error from Google Sheets:", error);
    return res.status(500).json({ error: "Failed to read stats from Google Sheets" });
  }
});

// Note: unlike server.ts (used for local dev / Docker on Back4app), this file
// does not call app.listen() or serve static files — Vercel's Node.js runtime
// invokes the exported Express app directly as a request handler, and static
// frontend files are served separately by Vercel's CDN per vercel.json.

export default app;
