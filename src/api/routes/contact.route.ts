import { Router } from "express";
import contactController from "../controllers/contact.controller";

const router = Router();

router.post("/addContact", contactController.addContact);
router.get("/getContactByUserId", contactController.getContactsByUserId);

export default router;
