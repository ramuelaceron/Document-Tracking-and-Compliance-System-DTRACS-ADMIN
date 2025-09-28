
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./TaskDetailPage.css";
import { ToastContainer } from "react-toastify"; // Removed unused 'toast'
import "react-toastify/dist/ReactToastify.css";
import { IoChevronBackOutline } from "react-icons/io5";

// ✅ Correct paths based on your folder structure
import TaskDescription from "../../components/TaskDetailComponents/TaskDescription/TaskDescription";
import SchoolStats from "../../components/TaskDetailComponents/SchoolStats/SchoolStats";

import { taskData } from "../../data/taskData";
import config from "../../config";

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const { state } = useLocation();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentUserRef = useRef(JSON.parse(sessionStorage.getItem("currentUser")) || null);
  const selectedFocal = currentUserRef.current?.user_id;
  const token = currentUserRef.current?.token;

  let initialTask = state?.taskData || null;

  if (!initialTask && sectionId) {
    const section = taskData[sectionId];
    if (section && Array.isArray(section)) {
      const taskId = state?.taskId;
      const taskTitle = state?.taskTitle;

      if (taskId) {
        for (const item of section) {
          const match = item.tasklist?.find((t) => t.task_id === taskId);
          if (match) {
            initialTask = match;
            break;
          }
        }
      }

      if (!initialTask && taskTitle) {
        for (const item of section) {
          const match = item.tasklist?.find((t) => t.title === taskTitle);
          if (match) {
            initialTask = match;
            break;
          }
        }
      }
    }
  }

  const fetchAssignmentsForSingleTask = async (task_id, token) => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/admin/task/assignments?task_id=${encodeURIComponent(task_id)}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error(`Failed to fetch assignments for task ${task_id}`);

      const data = await response.json();
      if (!Array.isArray(data)) return {};

      const schoolsRequired = new Set();
      const schoolsSubmitted = new Set();
      const accountsRequired = [];
      const accountsSubmitted = [];
      let latestSubmissionTime = null;
      let latestRemarks = "PENDING";

      data.forEach((assignment) => {
        if (!assignment.school_name || !assignment.account_name) return;

        schoolsRequired.add(assignment.school_name);
        if (assignment.status === "COMPLETE") {
          schoolsSubmitted.add(assignment.school_name);
          accountsSubmitted.push({ ...assignment, status: "COMPLETE" });

          const updatedAt = assignment.status_updated_at;
          if (updatedAt) {
            const updatedDate = new Date(updatedAt);
            if (!latestSubmissionTime || updatedDate > latestSubmissionTime) {
              latestSubmissionTime = updatedDate;
              latestRemarks = assignment.remarks || "TURNED IN ON TIME";
            }
          }
        }
        accountsRequired.push({
          ...assignment,
          status: assignment.status || "ONGOING",
        });
      });

      return {
        schools_required: Array.from(schoolsRequired),
        schools_submitted: Array.from(schoolsSubmitted),
        schools_not_submitted: Array.from(schoolsRequired).filter(s => !schoolsSubmitted.has(s)),
        accounts_required: accountsRequired,
        accounts_submitted: accountsSubmitted,
        accounts_not_submitted: accountsRequired.filter(acc => acc.status !== "COMPLETE"),
        completedTime: latestSubmissionTime ? latestSubmissionTime.toISOString() : null,
        remarks: latestRemarks, // ✅ Critical for late detection
      };
    } catch (err) {
      console.error("❌ Failed to fetch task assignments:", err);
      return {};
    }
  };

  useEffect(() => {
    const loadAndEnrichTask = async () => {
      setLoading(true);
      setError(null);

      if (!initialTask) {
        setLoading(false);
        return;
      }

      if (
        initialTask.schools_required &&
        initialTask.accounts_required &&
        initialTask.schools_required.length > 0
      ) {
        setTask(initialTask);
        setLoading(false);
        return;
      }

      if (!selectedFocal) {
        setTask(initialTask);
        setLoading(false);
        return;
      }

      try {
        const enrichment = await fetchAssignmentsForSingleTask(
          initialTask.task_id,
          token
        );

        const enrichedTask = {
          ...initialTask,
          ...enrichment,
        };

        setTask(enrichedTask);
      } catch (err) {
        setError("Failed to load school assignments.");
        setTask(initialTask);
      } finally {
        setLoading(false);
      }
    };

    loadAndEnrichTask();
  }, [initialTask, selectedFocal, token]); // ✅ Fixed dependencies

  useEffect(() => {
    const status = task?.task_status || state?.task_status;
    if (status === "COMPLETE") {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [task?.task_status, state?.task_status]);

  const handleBack = () => navigate(-1);

  if (!initialTask && !state) {
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

  if (loading) {
    return (
      <div className="task-detail-page">
        <div className="task-detail-left">
          <button className="task-back-btn" onClick={handleBack}>
            <IoChevronBackOutline className="icon-md" /> Back
          </button>
          <div className="loading">Loading ...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-detail-page">
        <div className="task-detail-left">
          <button className="task-back-btn" onClick={handleBack}>
            <IoChevronBackOutline className="icon-md" /> Back
          </button>
          <div className="error-container">{error}</div>
        </div>
        <div className="task-detail-right">Failed to load assignments.</div>
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
          task={task}
          creator_name={task?.creator_name}
          creation_date={task?.creation_date}
          completion_date={task?.completedTime || state?.completion_date || task?.completion_date}
          deadline={task?.deadline}
          description={task?.description}
          isCompleted={isCompleted}
          remarks={task?.remarks} // ✅ Pass remarks to enable late detection
        />
      </div>

      <div className="task-detail-right">
        <SchoolStats task={task} taskId={task?.task_id} sectionId={sectionId} />
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