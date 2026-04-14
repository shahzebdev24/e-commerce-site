import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";

// INFO: Create express app
const app = express();
const port = process.env.PORT || 4000;
connectCloudinary();
let isRetryingDb = false;

const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)
);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin/server-to-server requests without an Origin header.
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  credentials: true,
};

// INFO: Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// INFO: API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

// INFO: Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const startServer = async () => {
  await connectDB();

  // INFO: Keep retrying DB connection in background without crashing process
  setInterval(async () => {
    if (!isRetryingDb) {
      isRetryingDb = true;
      await connectDB();
      isRetryingDb = false;
    }
  }, 15000);

  app.listen(port, () =>
    console.log(`Server is running on at http://localhost:${port}`)
  );
};

startServer();
