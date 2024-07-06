import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { TxRouter } from "./routes";
import { port } from "./config";

const app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Define routes for different API endpoints
app.use("/api/moonshot", TxRouter);

app.get("/", async (req: any, res: any) => {
  res.send("Server is Running now!");
});

app.listen(9000, () => {
  console.log(`Server is running on port ${port}`);
});