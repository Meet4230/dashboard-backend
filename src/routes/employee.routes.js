import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getEmployeeDepartment,
  getEmployeeProfile,
} from "../controllers/employee.controller.js";
const router = Router();

router.route("/profile").get(verifyJWT, getEmployeeProfile);
router.route("/department").get(verifyJWT, getEmployeeDepartment);

export default router;
