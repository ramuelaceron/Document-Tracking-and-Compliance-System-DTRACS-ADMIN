// src/pages/School/School.jsx
import React from "react";
import "./RegisteredSchools.css";
import { schoolAccounts } from "../../data/schoolAccounts";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";


const RegisteredSchools = () => {
  return (
    <div className="admin-section">
      {/* Header */}
      <div className="school-header">
        <h2 className="school-title">Schools</h2>
      </div>

      {/* List of Schools */}
      <div className="school-list">
        {schoolAccounts.map((school, index) => (
          <div className="school-item" key={index}>
            {/* School Info: Logo + Name + Address */}
            <div className="school-info">
              <img
                src={school.logo}
                alt={`${school.school_name} logo`}
                className="school-logo"
              />
              <div className="school-text">
                <span className="schoolname">{school.school_name}</span>
                <p className="school-address">{school.school_address}</p>
              </div>
            </div>

            {/* Clickable Account Count → Links to specific school's accounts */}
            <Link to={`/schools/${school.slug}`} className="account-count-link" style={{ textDecoration: 'none' }}>
              <div className="account-count">
                <FaRegUser className="account-image" />
                <span>{school.accounts?.length || 0} Accounts</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisteredSchools;