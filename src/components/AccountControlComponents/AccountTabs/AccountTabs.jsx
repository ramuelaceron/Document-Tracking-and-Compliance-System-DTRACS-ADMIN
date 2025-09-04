import React, { useState } from "react";
import "./AccountTabs.css";

const AccountTabs = ({ onTabChange, onSortChange = {} }) => {
  const [activeTab, setActiveTab] = useState("verification");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="account-tabs-container">
      <div className="account-tabs">
        <button
          className={activeTab === "verification" ? "active" : ""}
          onClick={() => handleTabClick("verification")}
        >
          Verification
        </button>

        <button
          className={activeTab === "termination" ? "active" : ""}
          onClick={() => handleTabClick("termination")}
        >
          Termination
        </button>

        <button
          className={activeTab === "designation" ? "active" : ""}
          onClick={() => handleTabClick("designation")}
        >
          Designation
        </button>
      </div>
    </div>
  );
};

export default AccountTabs;