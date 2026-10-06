import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";


dotenv.config();
app.use(cors({
  //origin: ["http://localhost:5173"],
}));
app.use(cookieParser());

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});