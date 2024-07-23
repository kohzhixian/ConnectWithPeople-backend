import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export default function expressLoader() {
  const app = express();

  // middleware that transforms raw string of req.body into json
  app.use(express.json());

  // middleware that will parse the cookie header on the request
  app.use(cookieParser());
  // enables Cross-Origin Resource sharing
  const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true, // Enable credentials (cookies, authorization headers, TLS client certificates)
    })
  );

  // respond to all preflight OPTIONS requests for any path with appropriate CORS headers
  app.options("*", cors());

  return app;
}
