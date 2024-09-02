import express, { Request, Response } from "express";
import router from "./app/routes";
import cors from "cors";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";

const app = express();

//parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://car-rental-reservation-client.vercel.app",
    ],
    credentials: true,
  })
);
//application route
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcom to Simple Assignment 3!");
});

app.use(globalErrorHandler);
//not found
app.use(notFound);
export default app;
