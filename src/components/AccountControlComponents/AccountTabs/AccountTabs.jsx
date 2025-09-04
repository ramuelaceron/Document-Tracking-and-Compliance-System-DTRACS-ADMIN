import React, { useState, useEffect, useRef } from "react";
import "./AccountTabs.css";

const AccountTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("verification");
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: "translateX(0px)",
  });
  const tabsRef = useRef({});

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  useEffect(() => {
    const activePath = `/account/${activeTab}`;
    const activeEl = tabsRef.current[activePath];
    if (activeEl) {
      // Set the underline to jump instantly to this tab
      setIndicatorStyle({
        width: activeEl.offsetWidth,
        transform: `translateX(${activeEl.offsetLeft}px)`,
      });
    }
  }, [activeTab]);

  return (
    <div className="task-tabs-container">
      <div className="task-tabs">
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

        {/* Persistent underline — always rendered, never hidden */}
        <span className="tab-underline" style={indicatorStyle}></span>
      </div>
    </div>
  );
};

export default AccountTabs;