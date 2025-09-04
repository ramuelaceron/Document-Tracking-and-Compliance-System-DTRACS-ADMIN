import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./TaskTabs.css";

const TaskTabs = ({
  selectedSort,
  onSortChange,
  showUpcomingIndicator = false,
  showPastDueIndicator = false,
  showCompletedIndicator = false,
}) => {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: "translateX(0px)",
  });
  const tabsRef = useRef({});

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const activePath = location.pathname;
    const activeEl = tabsRef.current[activePath];
    if (activeEl) {
      setIndicatorStyle({
        width: activeEl.offsetWidth,
        transform: `translateX(${activeEl.offsetLeft}px)`,
      });
    }
  }, [location.pathname]);

  return (
    <div className="task-tabs-container">
      <div className="task-tabs">
        <Link
          ref={(el) => (tabsRef.current["/task/ongoing"] = el)}
          to="/task/ongoing"
          className={`task-tab ${isActive("/task/ongoing") ? "active" : ""}`}
        >
          Ongoing
          {showUpcomingIndicator && (
            <span className="task-indicator task-blue"></span>
          )}
        </Link>
        <Link
          ref={(el) => (tabsRef.current["/task/incomplete"] = el)}
          to="/task/incomplete"
          className={`task-tab ${isActive("/task/incomplete") ? "active" : ""}`}
        >
          Incomplete
          {showPastDueIndicator && (
            <span className="task-indicator task-red"></span>
          )}
        </Link>
        <Link
          ref={(el) => (tabsRef.current["/task/history"] = el)}
          to="/task/history"
          className={`task-tab ${isActive("/task/history") ? "active" : ""}`}
        >
          History
          {showCompletedIndicator && (
            <span className="task-indicator task-green"></span>
          )}
        </Link>

        {/* Sliding underline that persists */}
        <span className="tab-underline" style={indicatorStyle}></span>
      </div>

      <select
        className="task-dropdown"
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">Newest to Oldest</option>
        <option value="oldest">Oldest to Newest</option>
        <option value="today">Due Today</option>
        <option value="week">Due This Week</option>
        <option value="month">Due This Month</option>
      </select>
    </div>
  );
};

export default TaskTabs;