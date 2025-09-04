import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FiLogIn } from "react-icons/fi";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle2.jsx";
import "../../components/ParticleBackground/Particle2.css";
import logo from "../../assets/images/logo-w-text.png";
import { AdminAccountData, loginAccounts } from "../../data/accountData"; // Update path

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    // Check if email exists in loginAccounts
    if (loginAccounts[email]) {
      // Check if password matches (in real app, this would be hashed)
      if (password === loginAccounts[email].password) {
        // Store user in sessionStorage
        sessionStorage.setItem("currentUser", JSON.stringify(loginAccounts[email]));
        navigate("/sections"); // Redirect to sections after login
      } else {
        setError("Invalid password");
      }
    } else {
      setError("No account found with this email");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogoClick = () => {
    navigate("/login");
  };

  // Optional: Pre-fill with admin credentials for testing
  const fillAdminCredentials = () => {
    setEmail(AdminAccountData.email);
    setPassword(AdminAccountData.password);
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
                Please login or sign up to start your session.
              </p>
              {/* Optional: Add button to pre-fill admin credentials for testing */}
              <button 
                type="button" 
                className="fill-admin-btn"
                onClick={fillAdminCredentials}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Use Admin Account
              </button>
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
                    required
                  />
                  <button
                    type="button"
                    className="login-toggle-password"
                    onClick={togglePasswordVisibility}
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
              >
                <FiLogIn className="login-icon" />
                Log in
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