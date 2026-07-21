import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Normalize email
    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "fallback-secret-key-for-hackathon", {
      expiresIn: "1d"
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
