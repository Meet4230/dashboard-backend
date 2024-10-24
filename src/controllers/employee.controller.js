import Department from "../models/department.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getEmployeeProfile = asyncHandler(async (req, res) => {
  const employee = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  return res.status(200).json({
    success: true,
    data: employee,
  });
});

const getEmployeeDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findOne({
    employees: req.user._id,
  }).select("departmentName categoryName location salary");

  if (!department) {
    return res.status(200).json({
      success: true,
      message: "Not assigned to any department",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    data: department,
  });
});

export { getEmployeeProfile, getEmployeeDepartment };
