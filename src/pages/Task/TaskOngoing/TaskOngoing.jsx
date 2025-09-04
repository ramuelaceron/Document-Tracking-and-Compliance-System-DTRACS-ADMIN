import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { createSlug } from "../../../utils/idGenerator";
import CreateTask from "../../../components/CreateTask/CreateTask";
import { ToastContainer, toast } from "react-toastify";
import {
  formatDate,
  formatTime,
  getWeekday,
  getTaskCompletionStats,
} from "../../../utils/taskHelpers";
import "react-toastify/dist/ReactToastify.css";
import "./TaskOngoing.css";

const TaskOngoing = () => {
  // Get sorted tasks from context
  const { upcomingTasks, selectedSort } = useOutletContext();
  
  // Group tasks by formatted creation date
  const groupedByDate = upcomingTasks.reduce((groups, task) => {
    const formattedDate = formatDate(task.creation_date);
    if (!groups[formattedDate]) groups[formattedDate] = [];
    groups[formattedDate].push(task);
    return groups;
  }, {});

  // Sort dates based on selected sort option
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    try {
      if (selectedSort === "oldest") {
        return new Date(a) - new Date(b);
      } else {
        return new Date(b) - new Date(a); // Default: newest first
      }
    } catch (error) {
      return 0;
    }
  });

  const [openGroups, setOpenGroups] = useState(() =>
    sortedDates.reduce((acc, date) => ({ ...acc, [date]: true }), {})
  );

  const toggleGroup = (date) => {
    setOpenGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // Get appropriate empty message based on filter
  const getEmptyMessage = () => {
    switch (selectedSort) {
      case "today":
        return "No tasks due today.";
      case "week":
        return "No tasks due this week.";
      case "month":
        return "No tasks due this month.";
      default:
        return "No ongoing tasks at the moment.";
    }
  };

  return (
    <div className="ongoing-app">
      <main className="ongoing-main">
        <CreateTask
          onTaskCreated={() => {
            toast.success("Task created!");
          }}
        />

        {sortedDates.length > 0 ? (
          sortedDates.map((date) => {
            const tasks = groupedByDate[date];
            const weekday = getWeekday(date);
            const isOpen = openGroups[date];

            return (
              <div key={date} className="ongoing-date-group">
                <div
                  className="ongoing-date-header"
                  onClick={() => toggleGroup(date)}
                >
                  <span className="ongoing-date-bold">{date}</span>
                  <span className="ongoing-weekday"> ({weekday})</span>

                  <div className="ongoing-header-actions">
                    <span className="ongoing-task-count">{tasks.length}</span>
                    <span className="ongoing-dropdown-arrow">
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="ongoing-task-list">
                    {tasks.map((task) => {
                      const { total, completed } = getTaskCompletionStats(task);
                      
                      return (
                        <div className="ongoing-task-item" key={task.id}>
                          <div className="ongoing-task-header">
                            <div className="ongoing-task-icon">
                              <PiClipboardTextBold className="icon-lg" />
                            </div>
                            <div className="ongoing-task-info">
                              <div className="ongoing-task-title">
                                {task.title.trim() || "Untitled Task"}
                              </div>
                              <div className="ongoing-task-office">{task.office}</div>
                            </div>
                            <div className="ongoing-task-deadline">
                              Due on {formatDate(task.deadline)} at{" "}
                              <span className="ongoing-time">{formatTime(task.deadline)}</span>
                            </div>
                          </div>

                          <div className="ongoing-task-footer">
                            <Link
                              to={`/task/${task.sectionId}/${createSlug(task.title)}`}
                              state={{
                                taskData: task,
                                taskTitle: task.title,
                                deadline: task.deadline,
                                creation_date: task.creation_date,
                                taskDescription: task.description,
                                taskId: task.id,
                                creator_name: task.creator_name,
                                section_designation: task.section_designation,
                                section_name: task.sectionName,
                                full_name: task.creator_name,
                                task_status: task.task_status || "Ongoing"
                              }}
                              className="ongoing-description-link"
                            >
                              View Description
                            </Link>

                            <div className="ongoing-assigned-submitted-counts">
                              <div className="ongoing-count-item">
                                <span className="ongoing-count-number">
                                  {completed}
                                </span>
                                <span className="ongoing-count-label">Submitted</span>
                              </div>
                              <div className="ongoing-count-item">
                                <span className="ongoing-count-number">{total}</span>
                                <span className="ongoing-count-label">Assigned</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="ongoing-no-tasks">
            {getEmptyMessage()}
          </div>
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default TaskOngoing;