import React from "react";
import "./Sidebar.css";
import { MdTab } from "react-icons/md";
import { RiSchoolFill } from "react-icons/ri";
import { BiSolidUserAccount } from "react-icons/bi";
import { NavLink } from "react-router-dom";

const SchoolSidebar = ({ isExpanded }) => {
  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <nav className="sidebar-nav">
        <ul>
          {/* Home */}
          <li>
            <NavLink
              to="/sections"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              end={false} // Ensure this link is not treated as active when on the root path
            >
              <MdTab className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Sections</span>}
            </NavLink>
          </li>

          {/* To-do */}
          <li>
            <NavLink
              to="/registered-schools"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <RiSchoolFill className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Registered Schools</span>}
            </NavLink>
          </li>

          {/* Manage Account */}
          <li>
            <NavLink
              to="/account-control"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <BiSolidUserAccount className="sidebar-icon" />
              {isExpanded && (
                <span className="sidebar-text">Account Control</span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SchoolSidebar;