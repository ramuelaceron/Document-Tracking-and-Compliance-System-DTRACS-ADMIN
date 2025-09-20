import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import {
  formatDate,
  formatTime,
  getWeekday,
  getTaskCompletionStats,
} from "../../../utils/taskHelpers";
import "./TaskIncomplete.css";

const TaskIncomplete = () => {
  // ✅ Get pre-filtered past-due tasks and selected sort from ToDoPage layout
  const { pastDueTasks, selectedSort, loading, hasLoaded } = useOutletContext(); // 👈 Add hasLoaded

  // Group tasks by formatted creation date
  const groupedByDate = pastDueTasks.reduce((groups, task) => {
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

  // Track open/closed state for each group
  const [openGroups, setOpenGroups] = useState(() =>
    sortedDates.reduce((acc, date) => ({ ...acc, [date]: true }), {})
  );

  useEffect(() => {
    if (sortedDates.length > 0 && Object.keys(openGroups).length === 0) {
      setOpenGroups(sortedDates.reduce((acc, date) => ({ ...acc, [date]: true }), {}));
    }
  }, [sortedDates, openGroups]);

  

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
        return "No past-due tasks due today.";
      case "week":
        return "No past-due tasks due this week.";
      case "month":
        return "No past-due tasks due this month.";
      default:
        return "No past-due tasks.";
    }
  };

  return (
    <div className="incomplete-app">
      <main className="incomplete-main">
        {loading ? (
          <div className="incomplete-loading">
            <div className="incomplete-spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : hasLoaded && sortedDates.length === 0 ? ( // 👈 Only show empty message if loaded AND no tasks
          <div className="incomplete-no-tasks">
            {getEmptyMessage()}
          </div>
        ) : (
          sortedDates.map((date) => {
            const tasks = groupedByDate[date];
            const weekday = getWeekday(date);
            const isOpen = openGroups[date];

            return (
              <div key={date} className="incomplete-date-group">
                <div
                  className="incomplete-date-header"
                  onClick={() => toggleGroup(date)}
                >
                  <span className="incomplete-date-bold">{date}</span>
                  <span className="incomplete-weekday"> ({weekday})</span>

                  <div className="incomplete-header-actions">
                    <span className="incomplete-task-count">{tasks.length}</span>
                    <span className="incomplete-dropdown-arrow">
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="incomplete-task-list">
                    {tasks.map((task) => {
                      const { total, completed } = getTaskCompletionStats(task);
                      
                      return (
                        <div className="incomplete-task-item" key={task.task_id}>
                          <div className="incomplete-task-header">
                            <div className="incomplete-task-icon">
                              <PiClipboardTextBold className="icon-lg" />
                            </div>
                            <div className="incomplete-task-info">
                              <div className="incomplete-task-title">
                                {task.title}
                              </div>
                              <div className="incomplete-task-office">
                                {task.office}
                              </div>
                            </div>
                            <div className="incomplete-task-deadline">
                              Was due on {formatDate(task.deadline)} at{" "}
                              <span className="incomplete-time">{formatTime(task.deadline)}</span>
                            </div>
                          </div>

                          <div className="incomplete-task-footer">
                            <Link
                              to={`/task/${task.sectionId}/${task.taskSlug}`}
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
                                task_status: task.task_status || "INCOMPLETE"
                              }}
                              className="incomplete-description-link"
                            >
                              View Description
                            </Link>

                            <div className="incomplete-assigned-submitted-counts">
                              <div className="incomplete-count-item">
                                <span className="incomplete-count-number">
                                  {completed}
                                </span>
                                <span className="incomplete-count-label">Submitted</span>
                              </div>
                              <div className="incomplete-count-item">
                                <span className="incomplete-count-number">{total}</span>
                                <span className="incomplete-count-label">Assigned</span>
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
        )}
      </main>
    </div>
  );
};

export default TaskIncomplete;