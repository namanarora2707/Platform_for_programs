const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ Import CORS
const { connectDb } = require("./config/database");
const userRouter = require("./routes/user.Routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDb();

// ✅ Use CORS (you can allow all origins or restrict later)
app.use(cors({
  origin: "*", // or specify frontend domain like: "http://localhost:5173"
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Nodejs Authentication Tutorial");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
