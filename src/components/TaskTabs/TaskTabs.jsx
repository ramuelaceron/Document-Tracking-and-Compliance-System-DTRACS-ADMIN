import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import "./TaskTabs.css";

const TaskTabs = ({ selectedSort, onSortChange }) => {
  const location = useLocation();
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: "translateX(0px)",
  });
  const tabsRef = useRef({});

  // Check if tab is active
  const isActive = (path) => {
    return location.pathname === `/sections/${sectionId}/task/${path}`;
  };

  const handleBack = () => {
    navigate(); // Go back to previous page
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
  }, [location.pathname, sectionId]);

  return (
    <div className="task-tabs-container">
      <div className="task-tabs">
        {/* Back Button - styled as a tab */}
        <button 
          className="task-tab-back" 
          onClick={handleBack}
          ref={(el) => (tabsRef.current['back'] = el)}
        >
          <IoChevronBackOutline className="icon-md" />
          Back
        </button>

        <Link
          ref={(el) =>
            (tabsRef.current[`/sections/${sectionId}/task/ongoing`] = el)
          }
          to={`/sections/${sectionId}/task/ongoing`}
          className={`task-tab ${isActive("ongoing") ? "active" : ""}`}
        >
          Ongoing
        </Link>
        <Link
          ref={(el) =>
            (tabsRef.current[`/sections/${sectionId}/task/incomplete`] = el)
          }
          to={`/sections/${sectionId}/task/incomplete`}
          className={`task-tab ${isActive("incomplete") ? "active" : ""}`}
        >
          Incomplete
        </Link>
        <Link
          ref={(el) =>
            (tabsRef.current[`/sections/${sectionId}/task/history`] = el)
          }
          to={`/sections/${sectionId}/task/history`}
          className={`task-tab ${isActive("history") ? "active" : ""}`}
        >
          History
        </Link>
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