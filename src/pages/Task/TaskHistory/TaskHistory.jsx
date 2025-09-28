
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
import config from "../../../config"; // ✅ Add this import
import "./TaskHistory.css";

// ✅ Enrich single task with assignment data
const enrichTaskWithAssignment = async (task, token) => {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/admin/task/assignments?task_id=${encodeURIComponent(task.task_id)}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch assignments for task ${task.task_id}`);
      return task;
    }

    const assignments = await response.json();
    const completedAssignments = assignments.filter(a => a.status === "COMPLETE");

    if (completedAssignments.length === 0) return task;

    const latest = completedAssignments.reduce((prev, curr) => {
      const prevTime = prev.status_updated_at ? new Date(prev.status_updated_at) : new Date(0);
      const currTime = curr.status_updated_at ? new Date(curr.status_updated_at) : new Date(0);
      return currTime > prevTime ? curr : prev;
    });

    return {
      ...task,
      remarks: latest.remarks || task.remarks,
      status_updated_at: latest.status_updated_at || task.status_updated_at,
    };
  } catch (err) {
    console.error(`Error enriching task ${task.task_id}:`, err);
    return task;
  }
};

const TaskHistory = () => {
  const { completedTasks, selectedSort, loading, hasLoaded } = useOutletContext();

  const [enrichedTasks, setEnrichedTasks] = useState([]);
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);

  useEffect(() => {
    if (!hasLoaded || completedTasks.length === 0) {
      setEnrichedTasks([]);
      return;
    }

    setEnrichmentLoading(true);
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
    const token = currentUser.token;

    Promise.all(
      completedTasks.map(task => enrichTaskWithAssignment(task, token))
    ).then(tasks => {
      setEnrichedTasks(tasks);
      setEnrichmentLoading(false);
    }).catch(err => {
      console.error("Failed to enrich tasks:", err);
      setEnrichedTasks(completedTasks);
      setEnrichmentLoading(false);
    });
  }, [completedTasks, hasLoaded]);

  const tasksToUse = enrichedTasks.length > 0 ? enrichedTasks : completedTasks;
  const isLoading = loading || (hasLoaded && enrichmentLoading && completedTasks.length > 0);

  const groupedByDate = tasksToUse.reduce((groups, task) => {
    const completionDate = task.status_updated_at || task.completion_date || task.creation_date;
    const formattedDate = formatDate(completionDate);
    
    if (!groups[formattedDate]) groups[formattedDate] = [];
    groups[formattedDate].push(task);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    try {
      if (selectedSort === "oldest") {
        return new Date(a) - new Date(b);
      } else {
        return new Date(b) - new Date(a);
      }
    } catch (error) {
      return 0;
    }
  });

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

  const getEmptyMessage = () => {
    switch (selectedSort) {
      case "today":
        return "No completed tasks due today.";
      case "week":
        return "No completed tasks due this week.";
      case "month":
        return "No completed tasks due this month.";
      default:
        return "No completed tasks.";
    }
  };

  return (
    <div className="history-app">
      <main className="history-main">
        {isLoading ? (
          <div className="history-loading">
            <div className="history-spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : hasLoaded && sortedDates.length === 0 ? (
          <div className="history-no-tasks">
            {getEmptyMessage()}
          </div>
        ) : (
          sortedDates.map((date) => {
            const tasks = groupedByDate[date];
            const weekday = getWeekday(date);
            const isOpen = openGroups[date];

            return (
              <div key={date} className="history-date-group">
                <div
                  className="history-date-header"
                  onClick={() => toggleGroup(date)}
                >
                  <span className="history-date-bold">{date}</span>
                  <span className="history-weekday"> ({weekday})</span>

                  <div className="history-header-actions">
                    <span className="history-task-count">{tasks.length}</span>
                    <span className="history-dropdown-arrow">
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="history-task-list">
                    {tasks.map((task) => {
                      const { total, completed } = getTaskCompletionStats(task);
                      const actualCompletion = task.status_updated_at || task.completion_date || task.creation_date;

                      // ✅ Use remarks FIRST
                      const isLate = task.remarks === "TURNED IN LATE" || 
                        (task.deadline && actualCompletion && new Date(actualCompletion) > new Date(task.deadline));

                      return (
                        <div
                          className={`history-task-item ${isLate ? 'history-late' : ''}`}
                          key={task.task_id}
                        >
                          <div className="history-task-header">
                            <div className="history-task-icon">
                              <PiClipboardTextBold className="icon-lg" />
                            </div>
                            <div className="history-task-info">
                              <div className="history-task-title">
                                {task.title}
                              </div>
                              <div className="history-task-office">
                                {task.office}
                              </div>
                            </div>
                            <div className="history-task-completion">
                              Completed on {formatDate(actualCompletion)} at{" "}
                              <span className="history-time">{formatTime(actualCompletion)}</span>
                              {isLate && (
                                <span className="history-late-badge"> (Late)</span>
                              )}
                            </div>
                          </div>

                          <div className="history-task-footer">
                            <Link
                              to={`/task/${task.sectionId}/${task.taskSlug}`}
                              state={{
                                taskData: task,
                                taskTitle: task.title,
                                deadline: task.deadline,
                                creation_date: task.creation_date,
                                completion_date: actualCompletion,
                                taskDescription: task.description,
                                taskId: task.id,
                                creator_name: task.creator_name,
                                section_designation: task.section_designation,
                                section_name: task.sectionName,
                                full_name: task.creator_name,
                                task_status: "COMPLETE"
                              }}
                              className="history-description-link"
                            >
                              View Description
                            </Link>

                            <div className="history-assigned-submitted-counts">
                              <div className="history-count-item">
                                <span className="history-count-number">
                                  {completed}
                                </span>
                                <span className="history-count-label">Submitted</span>
                              </div>
                              <div className="history-count-item">
                                <span className="history-count-number">{total}</span>
                                <span className="history-count-label">Assigned</span>
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

export default TaskHistory;