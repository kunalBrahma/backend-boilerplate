import rateLimit from "express-rate-limit";

// Tighter limit for auth endpoints (login/register/password-reset) to slow
// down credential-stuffing and brute-force attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});
