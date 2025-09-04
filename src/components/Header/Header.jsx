import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/images/logo-w-text.png";
import { FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa"; 
import { IoChevronDownCircle } from "react-icons/io5";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogoClick = () => {
    navigate("/sections"); // Navigates to startup page
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
    // Add your logout logic here
    console.log("Signing out...");
    navigate("/"); 
    setIsDropdownOpen(false);
  };

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
            <FaUserCircle className="profile-main-icon" />
            <IoChevronDownCircle className="profile-sub-icon" />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <div className="profile-info">
              <FaUserCircle className="profile-avatar" />
              <div className="profile-details">
                <strong>Juan D Cruz</strong>
                <div className="profile-email">juandcruz@gmail.com</div>
                <div className="profile-id">2023-00***-01</div>
              </div>
            </div>
            <hr />
            <button className="dropdown-item" onClick={handleViewAccount}>
              <FaUser /> {/* 👈 simple profile icon */} 
              View account
            </button>
            <hr />
            <button className="dropdown-item" onClick={handleSignOut}>
              <FaSignOutAlt /> {/* 👈 sign-out arrow */}
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;