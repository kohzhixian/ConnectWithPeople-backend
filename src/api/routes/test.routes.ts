import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.send({ message: "router loader setup complete" });
});

export default router;
