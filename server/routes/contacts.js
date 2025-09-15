import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getContacts, createContact } from "../controllers/contactController.js";

const router = express.Router();

router.get("/", verifyToken, getContacts);
router.post("/", verifyToken, createContact);

export default router;