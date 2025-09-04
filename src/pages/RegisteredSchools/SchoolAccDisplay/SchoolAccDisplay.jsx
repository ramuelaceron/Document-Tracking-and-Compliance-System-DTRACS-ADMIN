// src/pages/Schools/AccountDisplay/AccountDisplay.jsx
import React from "react";
import "./SchoolAccDisplay.css";
import { useNavigate, useParams } from "react-router-dom";
import { schoolAccounts } from "../../../data/schoolAccounts";
import { IoChevronBackOutline } from "react-icons/io5";
import { generateAvatar } from "../../../utils/iconGenerator";

const SchoolAccDisplay = () => {
  const navigate = useNavigate();
  const { schoolSlug } = useParams();
  const school = schoolAccounts.find(s => s.slug === schoolSlug);

  const handleBack = () => navigate(-1);

  const hasAccounts = school.accounts && school.accounts.length > 0;

  return (
    <div className="account-section">
      <button className="account-back-btn" onClick={handleBack}>
        <IoChevronBackOutline className="icon-md" /> Back
      </button>
      <div className="account-header">
        <div className="account-header-info">
          <img src={school.logo} alt={`${school.school_name} logo`} className="account-header-logo" />
          <div>
            <h2 className="account-title">{school.school_name}</h2>
            <p className="account-subtitle">{school.school_address}</p>
          </div>
        </div>
      </div>

      {/* Account List */}
      <div className="account-list">
        {hasAccounts ? (
          school.accounts.map((account) => {
            const fullName = `${account.first_name} ${account.middle_name ? `${account.middle_name} ` : ""}${account.last_name}`;
            const { initials, color } = generateAvatar(fullName);
            
            return (
              <div className="account-item" key={account.id}>
                <div className="account-info">
                  {account.avatar ? (
                    <img src={account.avatar} alt="" className="account-logo" />
                  ) : (
                    <div 
                      className="account-avatar-placeholder"
                      style={{ backgroundColor: color }}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="account-text">
                    <span className="accountname">{fullName}</span>
                    <p className="account-address">{account.position}</p>
                  </div>
                </div>
                <div className="account-email">
                  <span>{account.email}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-accounts">
            <span>No accounts available for this school.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolAccDisplay;