import { Router } from "express";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartments,
  assignEmployeesToDepartment,
} from "../controllers/department.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isManager } from "../middleware/roles.middleware.js";
const router = Router();

// Department routes
router
  .route("/departments")
  .get(verifyJWT, isManager, getDepartments)
  .post(verifyJWT, isManager, createDepartment);

router
  .route("/departments/:departmentId")
  .put(verifyJWT, isManager, updateDepartment)
  .delete(verifyJWT, isManager, deleteDepartment);

router
  .route("/departments/:departmentId/assign")
  .post(verifyJWT, isManager, assignEmployeesToDepartment);

export default router;
