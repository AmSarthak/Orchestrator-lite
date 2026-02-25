// index.ts

import express from "express";
import routes from "./api";
import { startWebsocket } from "./step-runner";

const app = express();

app.use(express.json());
app.use(routes);

startWebsocket()
app.listen(3000, () => {
  console.log("FlowRunner running on port 3000");
});