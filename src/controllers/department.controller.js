import Department from "../models/department.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createDepartment = asyncHandler(async (req, res) => {
  if (req.user.role !== "manager") {
    throw new ApiError(403, "Only managers can create departments");
  }

  const { departmentName, categoryName, location, salary } = req.body;

  const department = await Department.create({
    departmentName,
    categoryName,
    location,
    salary,
  });

  return res.status(201).json({
    success: true,
    message: "Department created successfully",
    data: department,
  });
});

const updateDepartment = asyncHandler(async (req, res) => {
  try {
    // Check for required role
    if (req.user.role !== "manager") {
      throw new ApiError(403, "Only managers can update departments");
    }

    // Validate department ID
    const { departmentId } = req.params;
    if (!departmentId) {
      throw new ApiError(400, "Department ID is required");
    }

    // Validate updates object
    const updates = req.body;
    if (!updates || Object.keys(updates).length === 0) {
      throw new ApiError(400, "No updates provided");
    }

    // Attempt to update the department
    const department = await Department.findByIdAndUpdate(
      departmentId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    console.error("Update Department Error:", error);
    throw error;
  }
});
const getDepartments = asyncHandler(async (req, res) => {
  if (req.user.role !== "manager") {
    throw new ApiError(403, "Only managers can view all departments");
  }

  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const departments = await Department.find()
    .populate("employees", "firstName lastName email")
    .skip(skip)
    .limit(limit);

  const total = await Department.countDocuments();

  console.log("Departments Retrieved:", departments);

  return res.status(200).json({
    success: true,
    data: departments,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    },
  });
});

const assignEmployeesToDepartment = asyncHandler(async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { employeeIds } = req.body;

    console.log("Assigning employees:", { departmentId, employeeIds });

    // Validate inputs
    if (!departmentId) {
      throw new ApiError(400, "Department ID is required");
    }
    if (
      !employeeIds ||
      !Array.isArray(employeeIds) ||
      employeeIds.length === 0
    ) {
      throw new ApiError(400, "Valid employee IDs array is required");
    }

    // Find the department
    const department = await Department.findById(departmentId);
    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    // Verify all employees exist and are valid
    const employees = await User.find({ _id: { $in: employeeIds } });
    if (employees.length !== employeeIds.length) {
      throw new ApiError(400, "One or more employee IDs are invalid");
    }

    // Update department with new employee IDs
    department.employees = [
      ...new Set([...department.employees, ...employeeIds]),
    ];
    await department.save();

    // Update employees with department ID
    await User.updateMany(
      { _id: { $in: employeeIds } },
      { $set: { departmentId: departmentId } }
    );

    return res.status(200).json({
      success: true,
      message: "Employees assigned successfully",
      data: department,
    });
  } catch (error) {
    console.error("Error in assignEmployeesToDepartment:", error);
    throw error;
  }
});

const deleteDepartment = asyncHandler(async (req, res) => {
  try {
    // Check for required role
    if (req.user.role !== "manager") {
      throw new ApiError(403, "Only managers can delete departments");
    }

    // Validate department ID
    const { departmentId } = req.params;
    if (!departmentId) {
      throw new ApiError(400, "Department ID is required");
    }

    // Attempt to delete the department
    const department = await Department.findByIdAndDelete(departmentId);

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      data: department,
    });
  } catch (error) {
    console.error("Delete Department Error:", error);
    throw error;
  }
});

export {
  createDepartment,
  updateDepartment,
  getDepartments,
  assignEmployeesToDepartment,
  deleteDepartment,
};
