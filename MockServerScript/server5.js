// backend/index.ts (or .js)

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");


const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5143;
const SECRET = "your_jwt_secret"; // Use env var in production

// Dummy user store
const users = [
  { username: "admin", password: "adminpass", role: "admin" },
  { username: "user", password: "userpass", role: "user" },
];

// Dummy data
let memberBulletins = [
  { id: "1", title: "Member Bulletin 1", category: "news", content: "Content 1" },
  { id: "2", title: "Member Bulletin 2", category: "info", content: "Content 2" },
];
let officialBulletins = [
  { id: "1", title: "Official Bulletin 1", content: "Official Content 1", createdAt: new Date() },
  { id: "2", title: "Official Bulletin 2", content: "Official Content 2", createdAt: new Date() },
];

// Middleware to check JWT token and attach user to req
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login endpoint
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET, { expiresIn: "1h" });
  res.json({ success: true, token, role: user.role });
});

// GET member bulletins (public or authenticated? Your frontend requires token to delete/edit, but not clear if for GET)
app.get("/api/bulletins/member", authenticateToken, (req, res) => {
  res.json(memberBulletins);
});

// GET single member bulletin
app.get("/api/bulletins/member/:id", authenticateToken, (req, res) => {
  const item = memberBulletins.find((b) => b.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// DELETE member bulletin (any logged-in user with role user or admin)
app.delete("/api/bulletins/member/:id", authenticateToken, (req, res) => {
  if (!["user", "admin"].includes(req.user.role)) return res.sendStatus(403);

  memberBulletins = memberBulletins.filter((b) => b.id !== req.params.id);
  res.json({ success: true });
});

// PUT and POST for member bulletins if you want, add similarly

// GET official bulletins (maybe public or auth required)
app.get("/api/bulletins/official", authenticateToken, (req, res) => {
  res.json(officialBulletins);
});

// GET single official bulletin
app.get("/api/bulletins/official/:id", authenticateToken, (req, res) => {
  const item = officialBulletins.find((b) => b.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// DELETE official bulletin (admin only)
app.delete("/api/bulletins/official/:id", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);

  officialBulletins = officialBulletins.filter((b) => b.id !== req.params.id);
  res.json({ success: true });
});

// Edit, create official bulletins similar

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
