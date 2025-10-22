const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDb } = require("./config/database");
const userRouter = require("./routes/user.Routes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDb();

// ✅ Allow frontend URLs
app.use(cors({
  origin: [
    "https://your-frontend-name.vercel.app", // <-- change to your actual frontend deploy link
    "http://localhost:8080", // <-- for local testing
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Nodejs Authentication Tutorial");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
