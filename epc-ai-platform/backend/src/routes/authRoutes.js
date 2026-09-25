import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Normalize email
    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    // 1. Try finding user in MongoDB if connected
    let user = null;
    try {
      if (User.db && User.db.readyState === 1) {
        user = await User.findOne({ email: normalizedEmail });
      }
    } catch (dbErr) {
      console.warn("[auth] DB lookup error (using fallback if demo user):", dbErr.message);
    }

    if (user) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const payload = {
          id: user._id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "fallback-secret-key-for-hackathon", {
          expiresIn: "1d"
        });

        return res.json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
          }
        });
      }
    }

    // 2. Demo account fallback (guarantees login works even if DB is empty or disconnected)
    const demoAccounts = {
      "admin@nexus.com": { id: "demo_admin_01", role: "admin", tenantId: "tenant_demo", password: "password123" },
      "vendor@nexus.com": { id: "demo_vendor_01", role: "vendor", tenantId: "tenant_demo", password: "password123" }
    };

    const demo = demoAccounts[normalizedEmail];
    if (demo && password === demo.password) {
      const payload = {
        id: demo.id,
        email: normalizedEmail,
        role: demo.role,
        tenantId: demo.tenantId
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET || "fallback-secret-key-for-hackathon", {
        expiresIn: "1d"
      });

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: demo.id,
          email: normalizedEmail,
          role: demo.role,
        }
      });
    }

    return res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    next(err);
  }
});

export default router;
