import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();

dotenv.config({
  path: "./.env",
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes imports
import authRoutes from "./routes/auth.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import queryRoutes from "./routes/query.routes.js";
import employeeRoutes from "./routes/employee.routes.js";

// routes declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/query", queryRoutes);
app.use("/api/v1/employee", employeeRoutes);

export { app };
