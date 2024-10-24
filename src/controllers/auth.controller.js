import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, gender, hobbies, role } =
    req.body;

  console.log("req.body", req.body);

  // Validate email format
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Validate password (8-20 chars, must contain letters, numbers, and special chars)
  if (
    !password.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/
    )
  ) {
    throw new ApiError(
      400,
      "Password must be 8-20 characters and include letters, numbers, and special characters"
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    gender,
    hobbies,
    role,
  });

  const createdUser = await User.findById(user._id).select("-password");

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: createdUser,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Update user with refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "User logged in successfully",
      user: {
        user,
      },
      accessToken,
      refreshToken,
    });
});

export { registerUser, loginUser };
