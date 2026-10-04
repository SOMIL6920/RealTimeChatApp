import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use("/apiauth", authRoutes);
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});