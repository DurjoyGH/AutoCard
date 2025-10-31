const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  generateToken,
  generateRefreshToken,
  generateVerificationToken,
  verifyToken,
} = require("../services/jwt");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../services/email");

async function hashPassord(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const newPassword = await hashPassord(password);
    const verificationToken = generateVerificationToken();

    const newUser = new User({
      name,
      email,
      password: newPassword,
      verification: {
        token: verificationToken,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 300000), // Expires in 5 minutes
      },
    });

    await newUser.save();

    const emailResult = await sendVerificationEmail(
      email,
      name,
      verificationToken
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
    }

    return res.status(201).json({
      message:
        "User registered successfully! Please check your email for the verification code.",
      emailSent: emailResult.success,
      userId: newUser._id,
      ...(process.env.NODE_ENV === "development" && {
        verificationToken: verificationToken,
      }),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your account first!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user._id });

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentID: user.studentID,
        isVerified: user.isVerified,
      },
      token: token,
      refreshToken: refreshToken,
      role: user.role,
      redirectTo:
        user.role === "admin" ? "/admin/dashboard" : "/profile",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { userId, verificationToken } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified!" });
    }

    if (!user.verification || !user.verification.token) {
      return res
        .status(400)
        .json({ message: "No verification token found or token expired!" });
    }

    if (user.verification.token !== verificationToken) {
      return res.status(400).json({ message: "Invalid verification token!" });
    }

    user.isVerified = true;
    user.verification = undefined;
    await user.save();

    const welcomeEmailResult = await sendWelcomeEmail(user.email, user.name);

    if (!welcomeEmailResult.success) {
      console.error("Failed to send welcome email:", welcomeEmailResult.error);
    }

    // Generate token for verified user
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user._id });

    res.status(200).json({
      message: "Account verified successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token: token,
      refreshToken: refreshToken,
      role: user.role,
      redirectTo:
        user.role === "admin" ? "/admin/dashboard" : "/profile",
      welcomeEmailSent: welcomeEmailResult.success,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.resendVerificationToken = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified!" });
    }

    const verificationToken = generateVerificationToken();

    user.verification = {
      token: verificationToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 300000), // Expires in 5 minutes
    };

    await user.save();

    const emailResult = await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
    }

    res.status(200).json({
      message: "New verification token generated and sent to your email!",
      emailSent: emailResult.success,
      userId: user._id,
      ...(process.env.NODE_ENV === "development" && {
        verificationToken: verificationToken,
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required!" });
    }

    const decoded = verifyToken(refreshToken);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Account not verified!" });
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const newToken = generateToken(tokenPayload);
    const newRefreshToken = generateRefreshToken({ id: user._id });

    res.status(200).json({
      message: "Token refreshed successfully!",
      token: newToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid refresh token!" });
  }
};

exports.getUserRole = async (req, res) => {
  try {
    const user = req.user;

    const rolePermissions = {
      admin: [
        "view_all_users",
        "manage_users",
        "approve_applications",
        "generate_reports",
        "system_settings",
      ],
      user: [
        "view_profile",
        "edit_profile",
        "apply_for_card",
        "view_application_status",
      ],
    };

    res.status(200).json({
      message: "Role information retrieved successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      role: user.role,
      permissions: rolePermissions[user.role] || [],
      redirectTo:
        user.role === "admin" ? "/admin/dashboard" : "/profile",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
