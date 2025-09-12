import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./TaskDetailPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoChevronBackOutline } from "react-icons/io5";

// Components
import TaskDescription from "../../components/TaskDetailComponents/TaskDescription/TaskDescription";
import SchoolStats from "../../components/TaskDetailComponents/SchoolStats/SchoolStats";

// Mock Data
import { taskData } from "../../data/taskData";

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const { state } = useLocation();

  const [isCompleted, setIsCompleted] = useState(false);
  const [isLate, setIsLate] = useState(false);

  // Use state data first, then try to find in taskData if needed
  let task = state?.taskData || null;

  // If we don't have task data from state, try to find it in taskData
  if (!task && sectionId) {
    const section = taskData[sectionId];
    if (section && Array.isArray(section)) {
      const taskId = state?.taskId;
      const taskTitle = state?.taskTitle;
      
      if (taskId) {
        for (const item of section) {
          const match = item.tasklist?.find((t) => t.task_id === taskId);
          if (match) {
            task = match;
            break;
          }
        }
      }
      
      if (!task && taskTitle) {
        for (const item of section) {
          const match = item.tasklist?.find((t) => t.title === taskTitle);
          if (match) {
            task = match;
            break;
          }
        }
      }
    }
  }

  // Fallback to state properties if task is still not found
  const taskTitle = task?.title || state?.taskTitle;
  const taskDeadline = task?.deadline || state?.deadline;
  const taskCreationDate = task?.creation_date || state?.creation_date;
  const taskDescription = task?.description || state?.taskDescription;
  const taskId = task?.task_id || state?.taskId;
  const creator_name = task?.creator_name || state?.creator_name || "Unknown Creator";
  const section_name = task?.sectionName || state?.section_name || "General";

  useEffect(() => {
    const status = task?.task_status || state?.task_status;
    if (status === "COMPLETE") {
      setIsCompleted(true);
      setIsLate(false);
    } else if (status === "INCOMPLETE") {
      setIsCompleted(false);
      setIsLate(true);
    } else {
      setIsCompleted(false);
      setIsLate(false);
    }
  }, [task?.task_status, state?.task_status]);

  const handleBack = () => navigate(-1);

  // Handle task not found
  if (!task && !state) {
    return (
      <div className="task-detail-app">
        <main className="task-detail-main">
          <button className="back-button" onClick={() => navigate(-1)}>
            <IoChevronBackOutline className="icon-md" /> Back
          </button>
          <div className="error-container">
            <p>⚠️ Task not found.</p>
            <small>Please go back and try again.</small>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="task-detail-page">
      <div className="task-detail-left">
        <button className="task-back-btn" onClick={handleBack}>
          <IoChevronBackOutline className="icon-md" /> Back
        </button>
          <TaskDescription
            task={task || {
              title: taskTitle,
              deadline: taskDeadline,
              creation_date: taskCreationDate,
              description: taskDescription,
              task_id: taskId,
              creator_name: creator_name,
              task_status: state?.task_status || "ONGOING",
              section: section_name
            }}
            creator_name={creator_name}
            creation_date={taskCreationDate}
            deadline={taskDeadline}
            description={taskDescription}
            isCompleted={isCompleted}
          />
      </div>

      <div className="task-detail-right">
        <SchoolStats task={task} taskId={taskId} sectionId={sectionId} />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
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

export default TaskDetailPage;