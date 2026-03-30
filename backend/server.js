const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const JWT_SECRET = "resume_analyzer_secret_key_2024";
const USERS_FILE = path.join(__dirname, "users.json");

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Multer: memory storage for uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ["text/plain", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only TXT and PDF files are allowed."));
  },
});

// ─── Skill Dictionary ──────────────────────────────────────────────────────
const SKILLS = [
  "Python", "Java", "C++", "JavaScript", "TypeScript",
  "React", "Node.js", "MongoDB", "SQL", "PostgreSQL",
  "MySQL", "AWS", "Docker", "Kubernetes", "Machine Learning",
  "Deep Learning", "Data Analysis", "HTML", "CSS", "Git",
  "Django", "Flask", "Spring", "TensorFlow", "PyTorch",
  "Redis", "GraphQL", "REST API", "Linux", "Azure",
];

// ─── User Helpers ──────────────────────────────────────────────────────────
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ─── Auth Middleware ───────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided." });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────

// Register
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  const users = readUsers();
  if (users.find((u) => u.email === email))
    return res.status(409).json({ error: "Email already registered." });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "Account created successfully." });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials." });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials." });

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, user: { name: user.name, email: user.email } });
});

// Analyze Resume
app.post("/api/analyze", authMiddleware, upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  let text = "";

  if (req.file.mimetype === "text/plain") {
    text = req.file.buffer.toString("utf-8");
  } else if (req.file.mimetype === "application/pdf") {
    try {
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(req.file.buffer);
      text = pdfData.text;
    } catch (err) {
      return res.status(500).json({ error: "Failed to parse PDF. Try uploading a TXT file." });
    }
  }

  // Keyword matching (case-insensitive)
  const textLower = text.toLowerCase();
  const detected = SKILLS.filter((skill) =>
    textLower.includes(skill.toLowerCase())
  );

  const score = detected.length;
  const total = SKILLS.length;
  const percentage = Math.round((score / total) * 100);

  // Tier label
  let tier = "Beginner";
  if (percentage >= 70) tier = "Expert";
  else if (percentage >= 45) tier = "Advanced";
  else if (percentage >= 25) tier = "Intermediate";

  res.json({
    detectedSkills: detected,
    allSkills: SKILLS,
    score,
    total,
    percentage,
    tier,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  });
});

// Catch-all: serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Resume Skill Analyzer running at http://localhost:${PORT}`);
  console.log(`   Frontend → http://localhost:${PORT}/login.html`);
});
