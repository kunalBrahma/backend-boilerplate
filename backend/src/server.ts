import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import { globalErrorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

const corsOptions = {
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
