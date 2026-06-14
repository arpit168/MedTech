import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      toast.error("All fields are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await api.post("/auth/login", payload);
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid server response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      toast.success("Welcome Back 👋");
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { 
      scale: 0.95,
      opacity: 0,
      y: 30
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.6
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const glowVariants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    tap: { scale: 0.98 }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: "0 20px 40px rgba(59,130,246,.35)",
      transition: { type: "spring", stiffness: 400, damping: 15 }
    },
    tap: { scale: 0.97 },
    loading: {
      scale: 0.98,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    animate: {
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    hover: {
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  };

  // const shakeAnimation = {
  //   shake: {
  //     x: [0, -10, 10, -10, 10, 0],
  //     transition: { duration: 0.4 }
  //   }
  // };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #0b1120;
          overflow-x: hidden;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(59,130,246,.18), transparent 30%),
            radial-gradient(circle at bottom left, rgba(168,85,247,.18), transparent 30%),
            #0b1120;
        }

        .login-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 430px;
          padding: 42px 34px;
          border-radius: 28px;
          background: rgba(15,23,42,.75);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,.08);
          box-shadow:
            0 30px 80px rgba(0,0,0,.45),
            inset 0 1px 0 rgba(255,255,255,.04);
          position: relative;
          overflow: hidden;
        }

        .login-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(56,189,248,.8),
            transparent
          );
        }

        .login-logo {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          background:
            linear-gradient(
              135deg,
              rgba(59,130,246,.22),
              rgba(168,85,247,.18)
            );
          border: 1px solid rgba(255,255,255,.08);
          box-shadow: 0 10px 40px rgba(59,130,246,.18);
        }

        .login-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          color: #f8fafc;
          margin-bottom: 8px;
          text-align: center;
        }

        .login-header p {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e1;
          letter-spacing: .04em;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.04);
          color: #f8fafc;
          font-size: 14px;
          transition: all .25s ease;
        }

        .login-input::placeholder {
          color: #64748b;
        }

        .login-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139,92,246,.15);
          background: rgba(255,255,255,.06);
        }

        .password-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-btn {
          background: none;
          border: none;
          color: #8b5cf6;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .forgot-btn:hover {
          color: #a78bfa;
        }

        .password-wrapper {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .toggle-password:hover {
          color: #cbd5e1;
          transform: translateY(-50%) scale(1.1);
        }

        .remember-box {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #94a3b8;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
        }

        .remember-box input {
          accent-color: #8b5cf6;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .login-btn {
          margin-top: 8px;
          width: 100%;
          border: none;
          border-radius: 16px;
          padding: 15px;
          font-size: 15px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed,
              #06b6d4
            );
          background-size: 200% auto;
          transition: all .3s ease;
          box-shadow: 0 14px 40px rgba(59,130,246,.25);
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          background-position: right center;
        }

        .login-btn:disabled {
          opacity: .7;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 26px;
          text-align: center;
        }

        .login-footer p {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 14px;
        }

        .signup-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border-radius: 14px;
          text-decoration: none;
          color: #a78bfa;
          border: 1px solid rgba(167,139,250,.25);
          background: rgba(167,139,250,.08);
          font-weight: 600;
          transition: all .25s ease;
        }

        .signup-link:hover {
          background: rgba(167,139,250,.15);
          border-color: rgba(167,139,250,.5);
          transform: translateY(-1px);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 34px 22px;
            border-radius: 22px;
          }

          .login-header h1 {
            font-size: 28px;
          }

          .login-logo {
            width: 64px;
            height: 64px;
            font-size: 28px;
          }
        }
      `}</style>

      <AnimatePresence mode="wait">
        <motion.main
          key="login-page"
          className="login-page"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Animated background glow */}
          <motion.div
            variants={glowVariants}
            animate="animate"
            style={{
              position: "absolute",
              width: "50%",
              height: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent)",
              borderRadius: "50%",
              top: "20%",
              left: "25%",
              pointerEvents: "none"
            }}
          />

          <motion.div
            className="login-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <motion.header
              className="login-header"
              variants={itemVariants}
            >
              <motion.div
                className="login-logo"
                variants={iconVariants}
                animate="animate"
                whileHover="hover"
              >
                🛡️
              </motion.div>

              <motion.h1 variants={itemVariants}>
                Welcome Back
              </motion.h1>

              <motion.p variants={itemVariants}>
                Sign in to your MedTech account
              </motion.p>
            </motion.header>

            <motion.form
              onSubmit={handleSubmit}
              className="login-form"
              variants={itemVariants}
            >
              <motion.div
                className="form-group"
                variants={itemVariants}
              >
                <label htmlFor="email">
                  Email Address
                </label>

                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  variants={inputVariants}
                  whileFocus="focus"
                  whileTap="tap"
                  required
                />
              </motion.div>

              <motion.div
                className="form-group"
                variants={itemVariants}
              >
                <div className="password-header">
                  <label htmlFor="password">
                    Password
                  </label>

                  <motion.button
                    type="button"
                    className="forgot-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Forgot Password?
                  </motion.button>
                </div>

                <div className="password-wrapper">
                  <motion.input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    placeholder="Enter password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    variants={inputVariants}
                    whileFocus="focus"
                    whileTap="tap"
                    required
                  />

                  <motion.button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle Password"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </motion.button>
                </div>
              </motion.div>

              <motion.label
                className="remember-box"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                />
                <span>Remember me for 30 days</span>
              </motion.label>

              <motion.button
                type="submit"
                disabled={loading}
                className="login-btn"
                variants={buttonVariants}
                initial="idle"
                whileHover={!loading ? "hover" : "idle"}
                whileTap={!loading ? "tap" : "idle"}
                animate={loading ? "loading" : "idle"}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ display: "inline-block" }}
                  >
                    ⚡
                  </motion.div>
                ) : (
                  "Sign In"
                )}
                {loading && " Signing In..."}
              </motion.button>
            </motion.form>

            <motion.footer
              className="login-footer"
              variants={itemVariants}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                New to MedTech?
              </motion.p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register" className="signup-link">
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    style={{ display: "inline-block", marginRight: "8px" }}
                  >
                    ✨
                  </motion.span>
                  Create Account
                </Link>
              </motion.div>
            </motion.footer>
          </motion.div>
        </motion.main>
      </AnimatePresence>
    </>
  );
};

export default Login;