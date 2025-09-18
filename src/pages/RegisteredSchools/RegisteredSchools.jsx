// src/pages/School/School.jsx
import React, { useState, useEffect } from "react";
import "./RegisteredSchools.css";
import { schoolAccounts } from "../../data/schoolAccounts"; // for logos, slugs, addresses
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../api/axios"; // ✅ Import Axios

const RegisteredSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountCounts = async () => {
      try {
        const enrichedSchools = await Promise.all(
          schoolAccounts.map(async (school) => {
            try {
              const response = await api.get(`/focal/school/accounts`, {
                params: { school_name: school.school_name }
              });
              const accounts = response.data || [];
              return {
                ...school,
                accountCount: accounts.length, // ✅ Real count from backend
                accounts: accounts // Optional: cache accounts if needed for performance
              };
            } catch (error) {
              console.warn(`Failed to fetch accounts for ${school.school_name}:`, error);
              return {
                ...school,
                accountCount: 0,
                accounts: []
              };
            }
          })
        );
        setSchools(enrichedSchools);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching school account data:", error);
        setLoading(false);
      }
    };

    fetchAccountCounts();
  }, []);

  if (loading) {
    return <div className="admin-section">Loading schools...</div>;
  }

  return (
    <div className="admin-section">
      {/* Header */}
      <div className="school-header">
        <h2 className="school-title">Schools</h2>
      </div>

      {/* List of Schools */}
      <div className="school-list">
        {schools.map((school, index) => (
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
                <span>{school.accountCount} Accounts</span> {/* ✅ Real count */}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisteredSchools;