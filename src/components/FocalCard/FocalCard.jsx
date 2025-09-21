import React from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { generateAvatar } from '../../utils/iconGenerator';
import "./FocalCard.css";
import { createSlug } from "../../utils/idGenerator";
import { FiChevronRight } from "react-icons/fi";

const COLORS = ["#4CAF50", "#E53935", "#1E88E5"];

// ✅ Custom Tooltip Component
const CustomTooltip = ({ active, payload, total }) => {
  if (!active || !payload || !total) return null;

  return (
    <div className="custom-tooltip" style={{
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      fontSize: '12px',
      lineHeight: '1.5'
    }}>
      {payload.map((entry, index) => {
        const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
        const taskWord = entry.value === 1 ? 'task' : 'tasks';
        return (
          <p key={index} style={{ margin: '4px 0', color: entry.color }}>
            ({percentage}%) {entry.name}: {entry.value} {taskWord}
          </p>
        );
      })}
    </div>
  );
};

const FocalCard = ({ section, name, stats, documents, sectionId, id, isSelected, onSelect }) => {
  const navigate = useNavigate();
  const isPersonnelAssigned = name !== "Not yet assigned";

  const { initials, color } = generateAvatar(name);

  const handleDocumentClick = (task) => {
    navigate(`/task/${sectionId}/${createSlug(task.title)}`, {
      state: {
        taskData: task,
        taskTitle: task.title,
        deadline: task.deadline,
        creation_date: task.creation_date,
        taskDescription: task.description,
        taskId: task.id,
        creator_name: task.creator_name,
        id: task.user_id,
        section_designation: task.section_designation,
        section_name: task.sectionName,
        full_name: task.creator_name,
        task_status: task.task_status || "Ongoing"
      }
    });
  };

  const handleHeaderClick = () => {
    onSelect();
    if (isPersonnelAssigned) {
      navigate(`/sections/${sectionId}/task/ongoing`);
    }
  };

  // Check if there are no documents/tasks available
  const hasTasks = documents && documents.length > 0;

  return (
    <div className={`focal-card ${isSelected ? 'focal-card-selected' : ''}`}>
      <div className="focal-header">
        <div 
          className="focal-header-left"
          onClick={handleHeaderClick}
          role="button"
          tabIndex={0}
        >
          <div 
            className="focal-avatar-generated"
            style={{ backgroundColor: color }}
            aria-label={`${name}'s avatar`}
          >
            {initials}
          </div>

          <div>
            <h3>{section}</h3>
            <p className={name === "Not yet assigned" ? "focal-name unassigned" : "focal-name"}>
              {name}
            </p>
          </div>
        </div>

        {isPersonnelAssigned ? (
          <button
            className="focal-view-task-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/sections/${sectionId}/task/ongoing`);
            }}
            aria-label="View Tasks"
            title="View Tasks"
          >
            <FiChevronRight size={40} />
          </button>
        ) : (
          <div 
            className="focal-no-personnel"
            title="No personnel assigned yet"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              color: '#999',
              fontWeight: 500,
              padding: '0 12px'
            }}
          >
            Unnavailable
          </div>
        )}
      </div>

      {isPersonnelAssigned && (
        <div className="focal-body">
          {/* Display No tasks at the moment in italic when there are no documents */}
          {!hasTasks ? (
            <div className="no-tasks-message">
              <em>No tasks at the moment</em>
            </div>
          ) : (
            <>
              <div className="focal-chart">
                <h4 className="summary">Summary</h4>
                
                <div style={{ width: 180, height: 180, margin: '0 auto' }}>
                  <PieChart width={180} height={180}>
                    <Pie
                      data={stats}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={85}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    {/* ✅ Custom Tooltip */}
                    <Tooltip content={<CustomTooltip total={stats.reduce((sum, entry) => sum + entry.value, 0)} />} />
                  </PieChart>
                </div>

                <div className="focal-legend">
                  <span><span className="legend-box completed"></span>Completed</span>
                  <span><span className="legend-box incomplete"></span>Incomplete</span>
                  <span><span className="legend-box pending"></span>Pending</span>
                </div>
              </div>

              <div className="focal-documents">
                {documents.map((doc, idx) => (
                  <button 
                    key={idx} 
                    className="focal-document"
                    onClick={() => handleDocumentClick(doc)}
                    disabled={!isPersonnelAssigned}
                    style={!isPersonnelAssigned ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                  >
                    <div className="subject-title">{doc.title}</div>
                    <div className="progress-wrapper">
                      <div className="progress-bar">  
                        <div
                          className="progress-fill"
                          style={{ width: `${doc.progress}%` }}
                        ></div>   
                      </div>
                      <span className="progress-value">{doc.progress}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FocalCard;