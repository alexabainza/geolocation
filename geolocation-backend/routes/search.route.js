import express from "express";
import { login, register, test } from "../controllers/auth.controller.js";
import {
  createSearch,
  deleteSearch,
  getSearch,
  getSearches,
} from "../controllers/search.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, createSearch);
router.delete("/", verifyToken, deleteSearch);
router.get("/", verifyToken, getSearches);
router.get("/:id", verifyToken, getSearch);
export default router;
