// routes.ts

import express from "express";
import { executeWorkflow } from "./step-runner";

const router = express.Router();

router.get("/" , async (req , res)=>{
    res.json("HealthCheck Ping Done");
})

router.post("/startWorkflow", async (req, res) => {
  const { steps } = req.body;

  if (!Array.isArray(steps)) {
    return res.status(400).json({ error: "steps must be an array" });
  }

  try {
    const result = await executeWorkflow(steps);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;