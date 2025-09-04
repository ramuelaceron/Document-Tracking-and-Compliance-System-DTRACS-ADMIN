import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./TaskDetailPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoChevronBackOutline } from "react-icons/io5";
import { RiAccountPinBoxLine } from "react-icons/ri";

// Components
import TaskDescription from "../../components/TaskDetailComponents/TaskDescription/TaskDescription";
import SchoolStats from "../../components/TaskDetailComponents/SchoolStats/SchoolStats";
import CommentBox from "../../components/CommentBox/CommentBox";
import CommentList from "../../components/CommentList/CommentList";
import SharedButton from "../../components/SharedButton/SharedButton";

// Hooks
import useClickOutside from "../../hooks/useClickOutside";

// Mock Data
import { taskData } from "../../data/taskData";

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const { state } = useLocation();

  // State for comments
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  
  // Refs
  const commentBoxRef = useRef(null);
  const editTextareaRef = useRef(null);

  // Close comment box when clicking outside
  useClickOutside(commentBoxRef, () => {
    if (showCommentBox) setShowCommentBox(false);
  });

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
    if (status === "Completed") {
      setIsCompleted(true);
      setIsLate(false);
    } else if (status === "Incomplete") {
      setIsCompleted(false);
      setIsLate(true);
    } else {
      setIsCompleted(false);
      setIsLate(false);
    }
  }, [task?.task_status, state?.task_status]);

  // Get current user once
  const savedUser = sessionStorage.getItem("currentUser");
  const currentUser = savedUser
    ? JSON.parse(savedUser)
    : { first_name: "Unknown", last_Name: "User", middle_name: "", email: "unknown@deped.gov.ph" };

  const fullName = `${currentUser.first_name} ${currentUser.middle_name ? currentUser.middle_name + " " : ""}${currentUser.last_name}`.trim();

  const handleBack = () => navigate(-1);

  // Comment handlers
  const handleCommentSubmit = (html) => {
    if (!html || !html.trim() || html === "<p><br></p>") {
      toast.warn("Please enter a comment.");
      return;
    }

    const newComment = {
      id: Date.now(),
      author: fullName,
      email: currentUser.email,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      time: new Date().toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).replace(/,/g, ""),
      text: html,
      isEdited: false,
    };

    setComments((prev) => [...prev, newComment]);
    setShowCommentBox(false);
    toast.success("Comment added successfully!");
  };

  const handleEditStart = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.style.height = "auto";
        editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`;
        editTextareaRef.current.focus();
      }
    }, 0);
  };

  const handleEditSave = () => {
    if (!editText.trim()) {
      toast.warn("Comment cannot be empty.");
      return;
    }
    setComments((prev) =>
      prev.map((c) =>
        c.id === editingId ? { ...c, text: editText.trim(), isEdited: true } : c
      )
    );
    setEditingId(null);
    setEditText("");
    toast.info("Comment updated!");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleDeleteComment = (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.error("Comment deleted.");
    }
  };

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

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
              task_status: state?.task_status || "Ongoing",
              section: section_name // Pass section name
            }}
            creator_name={creator_name}
            creation_date={taskCreationDate}
            deadline={taskDeadline}
            description={taskDescription}
            isCompleted={isCompleted}
          />
          
          {/* Comment Section */}
          <div className="comment-section">
            {/* Add Comment Button */}
            <SharedButton variant="text" size="medium" onClick={toggleCommentBox} aria-label="Add comment">
              <RiAccountPinBoxLine className="icon-md" /> Add comment
            </SharedButton>

            {/* Comment Input */}
            {showCommentBox && (
              <div ref={commentBoxRef}>
                <CommentBox onSubmit={handleCommentSubmit} />
              </div>
            )}

            {/* Comment List */}
            {comments.length > 0 && (
              <CommentList
                comments={comments}
                editingId={editingId}
                editText={editText}
                setEditText={setEditText}
                onEdit={handleEditStart}
                onSaveEdit={handleEditSave}
                onCancelEdit={handleEditCancel}
                onDelete={handleDeleteComment}
                currentUser={currentUser}
              />
            )}
          </div>
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