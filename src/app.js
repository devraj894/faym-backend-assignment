import express from "express";
import payoutRoutes from "./routes/payout.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/payout", payoutRoutes);
app.use("/api/v1/sales", saleRoutes);
app.use("/api/v1/users", userRoutes);

export default app;