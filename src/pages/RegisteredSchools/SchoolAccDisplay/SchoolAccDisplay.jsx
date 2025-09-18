// src/pages/Schools/AccountDisplay/AccountDisplay.jsx
import React, { useState, useEffect } from "react";
import "./SchoolAccDisplay.css";
import { useNavigate, useParams } from "react-router-dom";
import { schoolAccounts } from "../../../data/schoolAccounts"; // for logo, address, slug
import { IoChevronBackOutline } from "react-icons/io5";
import { generateAvatar } from "../../../utils/iconGenerator";
import api from "../../../api/axios"; // ✅ Import Axios

const SchoolAccDisplay = () => {
  const navigate = useNavigate();
  const { schoolSlug } = useParams();

  // Find school metadata (logo, address) from static data
  const schoolMetadata = schoolAccounts.find(s => s.slug === schoolSlug);
  
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBack = () => navigate(-1);

  useEffect(() => {
    if (!schoolMetadata) {
      setError("School not found");
      setLoading(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await api.get(`/focal/school/accounts`, {
          params: { school_name: schoolMetadata.school_name }
        });
        setAccounts(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching accounts:", error);

        setLoading(false);
      }
    };

    fetchAccounts();
  }, [schoolSlug, schoolMetadata]);

  if (!schoolMetadata) {
    return <div className="account-section">School not found.</div>;
  }

  if (loading) {
    return <div className="account-section">Loading accounts...</div>;
  }

  if (error) {
    return <div className="account-section" style={{ color: "red" }}>{error}</div>;
  }

  const hasAccounts = accounts.length > 0;

  return (
    <div className="account-section">
      <button className="account-back-btn" onClick={handleBack}>
        <IoChevronBackOutline className="icon-md" /> Back
      </button>
      <div className="account-header">
        <div className="account-header-info">
          <img 
            src={schoolMetadata.logo} 
            alt={`${schoolMetadata.school_name} logo`} 
            className="account-header-logo" 
          />
          <div>
            <h2 className="account-title">{schoolMetadata.school_name}</h2>
            <p className="account-subtitle">{schoolMetadata.school_address}</p>
          </div>
        </div>
      </div>

      {/* Account List */}
      <div className="account-list">
        {hasAccounts ? (
          accounts.map((account, index) => {
            const fullName = `${account.first_name} ${account.middle_name ? `${account.middle_name} ` : ""}${account.last_name}`;
            const { initials, color } = generateAvatar(fullName);
            
            return (
              <div className="account-item" key={account.user_id || index}>
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
                    <p className="account-address">{account.position || "No position"}</p>
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