import { asyncHandler } from "../utils/asyncHandler.js";

export const isManager = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  if (req.user.role !== "manager") {
    throw new ApiError(403, "Access denied. Managers only.");
  }

  next();
});
