import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Department from "../models/department.model.js";

const getITEmployeesLocationA = asyncHandler(async (req, res) => {
  if (req.user.role !== "manager") {
    throw new ApiError(403, "Only managers can access this query");
  }

  const departments = await Department.find({
    categoryName: "IT",
    location: /^A/i,
  }).populate("employees", "firstName lastName email");

  const employees = departments.reduce((acc, dept) => {
    return [...acc, ...dept.employees];
  }, []);

  return res.status(200).json({
    success: true,
    data: employees,
  });
});

const getSalesEmployeesSorted = asyncHandler(async (req, res) => {
  if (req.user.role !== "manager") {
    throw new ApiError(403, "Only managers can access this query");
  }

  const departments = await Department.find({
    categoryName: "Sales",
  }).populate({
    path: "employees",
    select: "firstName lastName email",
    options: { sort: { firstName: -1 } },
  });

  const employees = departments.reduce((acc, dept) => {
    return [...acc, ...dept.employees];
  }, []);

  return res.status(200).json({
    success: true,
    data: employees,
  });
});

export { getITEmployeesLocationA, getSalesEmployeesSorted };
