import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FiLogIn } from "react-icons/fi";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle2.jsx";
import "../../components/ParticleBackground/Particle2.css";
import logo from "../../assets/images/logo-w-text.png";

import config from "../../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Optional: show loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // console.log("Submitting login:", { email, password });

    try {
      const response = await fetch(`${config.API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // ✅ Login successful
      // Store user data in sessionStorage
      sessionStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...data,
          email, // take from the login input
        })
      );

      // Redirect to sections
      navigate("/sections");
    } catch (err) {
      // Network error or server unreachable
      setError("Unable to connect to server. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogoClick = () => {
    navigate("/login");
  };

  return (
    <div className="login-page">
      <div className="login-background-image">
        <img src={background} alt="DepEd Biñan City Building" />
      </div>
      <div className="login-blue-overlay">
        <ParticleBackground />
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-logo-container" onClick={handleLogoClick}>
              <img src={logo} className="logo-w-text" alt="Logo" />
            </div>
            <p className="login-subtitle">
              Please login to start your session.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">
                Email
              </label>
              <div className="login-input-group">
                <input
                  type="email"
                  id="email"
                  className="login-form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-form-label">
                Password
              </label>
              <div className="login-password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="login-form-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="login-forgot-password">
                <a href="#forgot" className="login-forgot-link">
                  I forgot my password
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  <FiLogIn className="login-icon" />
                  Log in
                </>
              )}
            </button>
          </form>

          <div className="login-terms-notice">
            <p>
              By using this service, you understand and agree to the DepEd
              Online Services{" "}
              <a href="#terms" className="login-terms-link">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#privacy" className="login-terms-link">
                Privacy Statement
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;