import express, { Express, Request, Response } from "express";

const app = express();
app.use(express.json());
const port = 3000

app.get("/", (req:Request, res:Response) => {
  res.send("HELLO WORLD");
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})