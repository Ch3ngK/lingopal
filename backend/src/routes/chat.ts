import { Router } from "express";
import { getAIResponse } from "../services/aiRouter.js";

const router = Router();

router.post("/", async (req, res) => {
  const { text, language } = req.body;

  try {
    const result = await getAIResponse(text, language);
    res.json(result);
  } catch {
    res.status(500).json({
      text: "Something went wrong",
      correction: "",
      followUp: "",
    });
  }
});

export default router;

