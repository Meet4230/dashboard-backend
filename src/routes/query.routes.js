import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isManager } from "../middleware/roles.middleware.js";
import {
  getITEmployeesLocationA,
  getSalesEmployeesSorted,
} from "../controllers/query.controller.js";

const router = Router();

router
  .route("/it-employees-location-a")
  .get(verifyJWT, isManager, getITEmployeesLocationA);
router
  .route("/sales-employees-sorted")
  .get(verifyJWT, isManager, getSalesEmployeesSorted);

export default router;
