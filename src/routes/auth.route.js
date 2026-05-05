import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../validators/user.schema.js";

const router = express.Router();

router.post("/register", validateRequest(userRegisterSchema), register);
router.post("/login", validateRequest(userLoginSchema), login);
router.get("/logout", logout);

export default router;
