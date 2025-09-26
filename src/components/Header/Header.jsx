// src/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/images/logo-w-text.png";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { IoChevronDownCircle } from "react-icons/io5";
import { generateAvatar } from "../../utils/iconGenerator";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarProps, setAvatarProps] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = sessionStorage.getItem("currentUser");

      if (!savedUser || savedUser === "undefined") {
        console.warn("No valid currentUser found in sessionStorage. User may not be logged in.");
        sessionStorage.removeItem("currentUser");
        setCurrentUser(null);
        setAvatarProps(null);
        return;
      }

      let user;
      try {
        user = JSON.parse(savedUser);
        if (!user || typeof user !== "object" || Array.isArray(user)) {
          throw new Error("Parsed user is not a valid object");
        }
      } catch (err) {
        console.error("Failed to parse currentUser from sessionStorage:", savedUser, err);
        sessionStorage.removeItem("currentUser");
        setCurrentUser(null);
        setAvatarProps(null);
        return;
      }

      // 🔄 Parse full_name into structured names if missing
      if (user.full_name && !user.first_name) {
        const nameParts = user.full_name.split(", ");
        if (nameParts.length === 2) {
          const lastName = nameParts[0].trim();
          const rest = nameParts[1].trim();
          const nameMatch = rest.match(/^(\S+)(?:\s+(\S+))?/);
          const firstName = nameMatch ? nameMatch[1] : rest;
          const middleName = nameMatch && nameMatch[2] ? nameMatch[2] : "";

          user = {
            ...user,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
          };

          sessionStorage.setItem("currentUser", JSON.stringify(user));
        }
      }

      setCurrentUser(user);

      const displayName =
        `${user.first_name || ""} ${user.middle_name || ""} ${user.last_name || ""}`.trim() ||
        user.full_name ||
        user.email ||
        "Unknown";

      setAvatarProps(generateAvatar(displayName));
    };

    // ✅ Load user on mount
    loadUser();

    // ✅ Listen for sessionStorage changes (login/logout from other tabs or components)
    const handleStorageChange = (e) => {
      if (e.key === "currentUser") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency — we handle updates via event

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewAccount = () => {
    navigate("/manage-account");
    setIsDropdownOpen(false);
  };

  const handleSignOut = async () => {
    try {
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      const accessToken = currentUser?.access_token;

      if (!accessToken) {
        console.warn("No access token found. Clearing session anyway.");
      } else {
        // Call the logout endpoint
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // Important: sends cookies with the request
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Logout failed:", errorData.detail || response.statusText);
          // Even if backend fails, we still clear client-side session for security
        }
      }
    } catch (err) {
      console.error("Error during logout request:", err);
      // Proceed to clear session anyway
    } finally {
      // ✅ Clear client-side session
      sessionStorage.removeItem("currentUser");
      setCurrentUser(null);
      setAvatarProps(null);

      // ✅ Hard redirect to login (prevents back navigation)
      window.location.replace("/login");
    }
  };

  if (!currentUser) {
    return (
      <header className="app-header">
        <div className="header-left">
          <button className="menu-btn" onClick={toggleSidebar}>
            <GiHamburgerMenu className="menu-icon" />
          </button>
          <div className="header-logo">
            <div className="header-logo-container" onClick={handleLogoClick}>
              <img src={logo} className="logo-w-text" alt="Logo" />
            </div>
          </div>
        </div>
        <div className="header-right">
          <span className="profile-placeholder">Guest</span>
        </div>
      </header>
    );
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <GiHamburgerMenu className="menu-icon" />
        </button>
        <div className="header-logo">
          <div className="header-logo-container" onClick={handleLogoClick}>
            <img src={logo} className="logo-w-text" alt="Logo" />
          </div>
        </div>
      </div>

      <div className="header-right" ref={dropdownRef}>
        <button className="profile-btn" onClick={toggleDropdown}>
          <div className="profile-icon-wrapper">
            <div
              className="generated-avatar"
              style={{ backgroundColor: avatarProps?.color || "#555" }}
            >
              {avatarProps?.initials || "?"}
            </div>
            <IoChevronDownCircle className="profile-sub-icon" />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <div className="profile-info">
              <div
                className="generated-avatar dropdown-avatar-generated"
                style={{ backgroundColor: avatarProps?.color || "#555" }}
              >
                {avatarProps?.initials || "?"}
              </div>
              <div className="header-profile-details">
                <strong>
                  {[
                    currentUser.first_name,
                    currentUser.middle_name,
                    currentUser.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </strong>
                <div className="profile-email">{currentUser.email}</div>
              </div>
            </div>
            <hr />
            <button className="dropdown-item" onClick={handleViewAccount}>
              <FaUser /> View account
            </button>
            <hr />
            <button className="dropdown-item" onClick={handleSignOut}>
              <FaSignOutAlt /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;