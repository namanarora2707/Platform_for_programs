const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDb } = require("./config/database");
const { signUp, login } = require("./controller/userController");
const { verifyToken } = require("./config/isAuth");
const User = require("./models/userModels");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDb();

// Allow frontend dev server (Vite) and localhost
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080",
    process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Auth endpoints (match client expectations)
app.post("/api/auth/signup", signUp);
app.post("/api/auth/login", login);

// Protected 'me' endpoint using JWT verifyToken middleware
app.get("/api/auth/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    const user = await User.findById(userId).select("_id email name");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ id: user._id, email: user.email, name: user.name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching user" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to Nodejs Authentication Tutorial");
});

app.listen(PORT, () => {
  console.log(`\u2705 Server is running on port ${PORT}`);
});
