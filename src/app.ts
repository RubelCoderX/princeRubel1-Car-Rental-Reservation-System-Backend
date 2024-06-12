import express, { Request, Response } from "express";
import router from "./app/routes";
import cors from "cors";

const app = express();

//parser
app.use(express.json());
app.use(cors());
//application route
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcom to Simple Assignment 3!");
});

export default app;
