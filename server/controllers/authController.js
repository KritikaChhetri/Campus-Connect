const bcrypt = require("bcryptjs");
const User = require("../models/User");

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_BYTES = 72;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const REGISTRATION_FIELDS = new Set(["name", "email", "password"]);
const LOGIN_FIELDS = new Set(["email", "password"]);

const getAuthData = (body, allowedFields, requireName) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Credentials must be a JSON object." };
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !allowedFields.has(field)
  );
  if (unknownFields.length > 0) {
    return { error: `Unsupported field(s): ${unknownFields.join(", ")}.` };
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (requireName && name.length < 2) {
    return { error: "Name must contain at least 2 characters." };
  }

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { error: "A valid email address is required." };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    return { error: "Password cannot exceed 72 UTF-8 bytes." };
  }

  return { data: { name, email, password } };
};

const sendAuthError = (res, error, operation) => {
  if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    error.code === 11000
  ) {
    return res.status(400).json({
      success: false,
      message:
        error.code === 11000
          ? "An account with this email already exists."
          : error.message,
    });
  }

  console.error(`Failed to ${operation}:`, error);
  return res.status(500).json({
    success: false,
    message: `Unable to ${operation}. Please try again later.`,
  });
};

const toPublicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const registerUser = async (req, res) => {
  const result = getAuthData(req.body, REGISTRATION_FIELDS, true);

  if (result.error) {
    return res.status(400).json({
      success: false,
      message: result.error,
    });
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await User.findOne({ email }).select("_id");

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: toPublicUser(user),
    });
  } catch (error) {
    return sendAuthError(res, error, "create account");
  }
};

const loginUser = async (req, res) => {
  const result = getAuthData(req.body, LOGIN_FIELDS, false);

  if (result.error) {
    return res.status(400).json({
      success: false,
      message: result.error,
    });
  }

  const { email, password } = result.data;

  try {
    const user = await User.findOne({ email }).select("+password");
    const passwordMatches =
      user && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: toPublicUser(user),
    });
  } catch (error) {
    return sendAuthError(res, error, "log in");
  }
};

module.exports = { registerUser, loginUser };
