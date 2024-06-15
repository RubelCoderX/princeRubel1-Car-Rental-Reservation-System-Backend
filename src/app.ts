import express, { Request, Response } from "express";
import router from "./app/routes";
import cors from "cors";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";

const app = express();

//parser
app.use(express.json());
app.use(cors());
//application route
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcom to Simple Assignment 3!");
});

app.use(globalErrorHandler);
//not found
app.use(notFound);
export default app;
