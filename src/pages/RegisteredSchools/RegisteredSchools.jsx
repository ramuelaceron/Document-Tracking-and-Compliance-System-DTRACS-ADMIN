// src/pages/School/School.jsx
import React from "react";
import "./RegisteredSchools.css";
import { schoolAccounts } from "../../data/schoolAccounts";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";


const RegisteredSchools = () => {
  return (
    <div className="admin-schools-section">
      {/* Header */}
      <div className="schools-header">
        <h2 className="schools-title">Schools</h2>
      </div>

      {/* List of Schools */}
      <div className="schools-list">
        {schoolAccounts.map((school, index) => (
          <div className="schools-item" key={index}>
            {/* School Info: Logo + Name + Address */}
            <div className="schools-info">
              <img
                src={school.logo}
                alt={`${school.school_name} logo`}
                className="schools-logo"
              />
              <div className="schools-text">
                <span className="schools-name">{school.school_name}</span>
                <p className="schools-address">{school.school_address}</p>
              </div>
            </div>

            {/* Clickable Account Count → Links to specific school's accounts */}
            <Link to={`/schools/${school.slug}`} className="schools-account-count-link" style={{ textDecoration: 'none' }}>
              <div className="schools-account-count">
                <FaRegUser className="schools-account-image" />
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