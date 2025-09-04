import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./TaskTabs.css";

const TaskTabs = ({
  selectedSort,
  onSortChange,
  showUpcomingIndicator = false,
  showPastDueIndicator = false,
  showCompletedIndicator = false,
}) => {
  const location = useLocation();
  const { sectionId } = useParams(); // Get the actual section ID from URL params
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: "translateX(0px)",
  });
  const tabsRef = useRef({});

  // Update the isActive function to use the actual sectionId
  const isActive = (path) => {
    // For exact matching with the current location
    return location.pathname === `/sections/${sectionId}/task/${path}`;
  };

  useEffect(() => {
    const activePath = location.pathname;
    const activeEl = tabsRef.current[activePath];
    if (activeEl) {
      setIndicatorStyle({
        width: activeEl.offsetWidth,
        transform: `translateX(${activeEl.offsetLeft}px)`,
      });
    }
  }, [location.pathname, sectionId]); // Add sectionId as dependency

  return (
    <div className="task-tabs-container">
      <div className="task-tabs">
        <Link
          ref={(el) => (tabsRef.current[`/sections/${sectionId}/task/ongoing`] = el)}
          to={`/sections/${sectionId}/task/ongoing`}
          className={`task-tab ${isActive("ongoing") ? "active" : ""}`}
        >
          Ongoing
          {showUpcomingIndicator && (
            <span className="task-indicator task-blue"></span>
          )}
        </Link>
        <Link
          ref={(el) => (tabsRef.current[`/sections/${sectionId}/task/incomplete`] = el)}
          to={`/sections/${sectionId}/task/incomplete`}
          className={`task-tab ${isActive("incomplete") ? "active" : ""}`}
        >
          Incomplete
          {showPastDueIndicator && (
            <span className="task-indicator task-red"></span>
          )}
        </Link>
        <Link
          ref={(el) => (tabsRef.current[`/sections/${sectionId}/task/history`] = el)}
          to={`/sections/${sectionId}/task/history`}
          className={`task-tab ${isActive("history") ? "active" : ""}`}
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