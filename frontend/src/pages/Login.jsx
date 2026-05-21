import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
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

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
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

      const response = await api.post(
        "/auth/login",
        payload
      );

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid server response");
      }

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          "true"
        );
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
          animation: fadeUp .5s ease;
        }

        .login-card::before {
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

        .login-header {
          text-align: center;
          margin-bottom: 34px;
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
        }

        .login-header p {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
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

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
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

      <main className="login-page">
        <div className="login-card">
          <header className="login-header">
            <div className="login-logo">
              🛡️
            </div>

            <h1>Welcome Back</h1>

            <p>
              Sign in to your MedTech account
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                className="login-input"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-btn"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="login-input"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label="Toggle Password"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <label className="remember-box">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() =>
                  setRememberMe((prev) => !prev)
                }
              />

              <span>
                Remember me for 30 days
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="login-btn"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          <footer className="login-footer">
            <p>New to MedTech?</p>

            <Link
              to="/register"
              className="signup-link"
            >
              Create Account
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
};

export default Login;