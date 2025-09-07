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

  // ✅ Parse full_name into first/middle/last name and generate avatar
  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (!savedUser) return;

    let user = JSON.parse(savedUser);

    // 🔄 Parse full_name if structured names are missing
    if (user.full_name && !user.first_name) {
      const nameParts = user.full_name.split(", ");
      if (nameParts.length === 2) {
        const lastName = nameParts[0].trim();
        const rest = nameParts[1].trim(); // e.g., "Bayani M."
        const nameMatch = rest.match(/^(\S+)(?:\s+(\S+))?/); // First and optional middle
        const firstName = nameMatch ? nameMatch[1] : rest;
        const middleName = nameMatch && nameMatch[2] ? nameMatch[2] : "";

        user = {
          ...user,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
        };

        // Save enhanced user back to session storage
        sessionStorage.setItem("currentUser", JSON.stringify(user));
      }
    }

    setCurrentUser(user);

    // ✅ Generate avatar from full name
    const displayName = `${user.first_name || ""} ${user.middle_name || ""} ${user.last_name || ""}`.trim() ||
                        user.full_name ||
                        user.email ||
                        "Unknown";

    setAvatarProps(generateAvatar(displayName));
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
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

  const handleSignOut = () => {
    sessionStorage.removeItem("currentUser");
    setCurrentUser(null);
    setAvatarProps(null);
    navigate("/");
    setIsDropdownOpen(false);
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
          <span className="profile-placeholder">Loading...</span>
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

      {/* Profile Dropdown */}
      <div className="header-right" ref={dropdownRef}>
        <button className="profile-btn" onClick={toggleDropdown}>
          <div className="profile-icon-wrapper">
            {/* Generated initials avatar */}
            <div
              className="generated-avatar"
              style={{ backgroundColor: avatarProps?.color || "#555" }}
            >
              {avatarProps?.initials}
            </div>
            <IoChevronDownCircle className="profile-sub-icon" />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <div className="profile-info">
              {/* Avatar in dropdown */}
              <div
                className="generated-avatar dropdown-avatar-generated"
                style={{ backgroundColor: avatarProps?.color || "#555" }}
              >
                {avatarProps?.initials}
              </div>
              <div className="header-profile-details">
                <strong>
                  {currentUser.first_name} {currentUser.middle_name} {currentUser.last_name}
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