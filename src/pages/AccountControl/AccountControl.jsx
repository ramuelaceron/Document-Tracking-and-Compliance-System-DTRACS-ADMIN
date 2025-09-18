// src/pages/AccountControl/AccountControl.jsx
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AccountControl.css";

// Components
import AccountTabs from "../../components/AccountControlComponents/AccountTabs/AccountTabs";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountControl = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL pathname
  const getActiveTabFromPath = () => {
    if (location.pathname.includes("/verification")) return "verification";
    if (location.pathname.includes("/terminate")) return "termination";
    if (location.pathname.includes("/designation")) return "designation";
    return "verification"; // default
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [sortFilter, setSortFilter] = useState("All");

  // Sync tab with URL
  useEffect(() => {
    const tab = getActiveTabFromPath();
    setActiveTab(tab);
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSortFilter("All");

    // Navigate to respective child route
    if (tab === "verification") {
      navigate("/account-control/verification");
    } else if (tab === "termination") {
      navigate("/account-control/terminate");
    } else if (tab === "designation") {
      navigate("/account-control/designation");
    }
  };

  const handleSortChange = (e) => {
    setSortFilter(e.target.value);
  };

  // Show filter only in Verification and Termination
  const showFilter = activeTab === "verification" || activeTab === "termination";

  return (
    <div className="account-control">
      {/* Tabs with Filter */}
      <AccountTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        sortFilter={sortFilter}
        onSortChange={handleSortChange}
      />

      {/* Render child page */}
      <Outlet context={{ activeTab, sortFilter, setSortFilter }} />

      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
};

export default AccountControl;