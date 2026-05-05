import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
import todoRouter from "./routes/todo.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();
const PORT = 8000;

config();
connectDB();

// body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/todo", todoRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

async function gracefulShutdown(exitCode = 1) {
  try {
    // we are converting callback based close function into promise based
    // so that we can use await on it
    // server will resolve existing request and once done
    // it will resolve and program will move forward
    await new Promise((resolve) => server.close(resolve));
    await disconnectDB();
  } catch (err) {
    console.log("Error during shutdown:", err);
  } finally {
    process.exit(exitCode);
  }
}

// handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection: ", err);
  gracefulShutdown(1);
});

// handle uncaught exception
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception: ", err);
  gracefulShutdown(1);
});

// graceful shutdown
process.on("SIGTERM", (err) => {
  console.log("SIGTERM received, shutting down gracefully");
  gracefulShutdown(0);
});
