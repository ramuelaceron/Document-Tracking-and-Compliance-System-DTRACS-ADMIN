// src/components/TaskComments/TaskComments.jsx
import React from "react";
import "./TaskComments.css";
import { generateAvatar } from "../../utils/iconGenerator";

const TaskComments = ({ comments }) => {
  return (
    <div className="task-comments">
      <div className="task-comments-list">
        {comments.map((comment, index) => {
          const avatarInfo = generateAvatar(comment.account_name);
          
          return (
            <div key={index} className="task-comment-item">
              <div className="task-comment-avatar">
                {comment.avatar ? (
                  <img src={comment.avatar} alt={comment.account_name} />
                ) : (
                  <div 
                    className="avatar-placeholder"
                    style={{ backgroundColor: avatarInfo.color }}
                  >
                    {avatarInfo.initials}
                  </div>
                )}
              </div>
              <div className="task-comment-content">
                <div className="task-comment-header">
                  <span className="task-comment-author">{comment.account_name}</span>
                  <span className="task-comment-email">{comment.email}</span>
                </div>
                <div className="task-comment-message">{comment.message}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskComments;