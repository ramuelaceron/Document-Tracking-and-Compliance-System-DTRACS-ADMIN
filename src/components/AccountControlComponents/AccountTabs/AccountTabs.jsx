// src/components/AccountControlComponents/AccountTabs/AccountTabs.jsx
import React, { useState, useEffect, useRef } from "react";
import "./AccountTabs.css";

const AccountTabs = ({ activeTab: controlledTab, onTabChange, sortFilter, onSortChange }) => {
  const [activeTab, setActiveTab] = useState("verification");
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: "translateX(0px)",
  });
  const tabsRef = useRef({});

  // Sync local activeTab if parent controls it
  useEffect(() => {
    if (controlledTab) {
      setActiveTab(controlledTab);
    }
  }, [controlledTab]);

  // Update indicator when activeTab changes
  useEffect(() => {
    const activePath = `/account/${activeTab}`;
    const activeEl = tabsRef.current[activePath];
    if (activeEl) {
      setIndicatorStyle({
        width: activeEl.offsetWidth,
        transform: `translateX(${activeEl.offsetLeft}px)`,
      });
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  // Show filter only in Verification and Termination
  const showFilter = activeTab === "verification" || activeTab === "termination";

  return (
    <div className="task-tabs-container">
      <div className="task-tabs">
        {/* Tab Buttons */}
        <button
          ref={(el) => (tabsRef.current["/account/verification"] = el)}
          className={`task-tab ${activeTab === "verification" ? "active" : ""}`}
          onClick={() => handleTabClick("verification")}
        >
          Verification
        </button>

        <button
          ref={(el) => (tabsRef.current["/account/termination"] = el)}
          className={`task-tab ${activeTab === "termination" ? "active" : ""}`}
          onClick={() => handleTabClick("termination")}
        >
          Termination
        </button>

        <button
          ref={(el) => (tabsRef.current["/account/designation"] = el)}
          className={`task-tab ${activeTab === "designation" ? "active" : ""}`}
          onClick={() => handleTabClick("designation")}
        >
          Designation
        </button>

        {/* Persistent underline */}
        <span className="tab-underline" style={indicatorStyle}></span>
      </div>

      {/* ✅ Moved outside wrapper, directly in container */}
      {/* ✅ No extra div wrapper around select */}
      {showFilter && (
        <select
          className="task-dropdown"
          value={sortFilter}
          onChange={onSortChange} // ✅ Direct event passed
        >
          <option value="All">All Accounts</option>
          <option value="School">School</option>
          <option value="Focal">Focals</option>
        </select>
      )}
    </div>
  );
};

export default AccountTabs;