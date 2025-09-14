import React from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { generateAvatar } from '../../utils/iconGenerator';
import "./FocalCard.css";
import { createSlug } from "../../utils/idGenerator";

const COLORS = ["#4CAF50", "#E53935", "#1E88E5"];

const FocalCard = ({ section, name, stats, documents, sectionId, id, isSelected, onSelect }) => {
  const navigate = useNavigate();

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
    navigate(`/sections/${sectionId}/task/ongoing`);
  };

  // Optional: Show fallback if no data
  if (!stats || stats.length === 0) {
    return <div className="focal-card">No data available</div>;
  }

  return (
    <div className={`focal-card ${isSelected ? 'focal-card-selected' : ''}`}>
      <div 
        className="focal-header" 
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

      <div className="focal-body">
        <div className="focal-chart">
          <h4 className="summary">Summary</h4>
          
          {/* FIXED: Use simple div + explicit width/height on PieChart */}
          <div style={{ width: 180, height: 180, margin: '0 auto' }}>
            <PieChart width={180} height={180}>
              <Pie
                data={stats}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={75}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}`, name]} />
            </PieChart>
          </div>

          <div className="focal-legend">
            <span><span className="legend-box completed"></span>Completed</span>
            <span><span className="legend-box incomplete"></span>Incomplete</span>
            <span><span className="legend-box pending"></span>Pending</span>
          </div>
        </div>

        <div className="focal-documents">
          {documents.length > 0 ? (
            documents.map((doc, idx) => (
              <button 
                key={idx} 
                className="focal-document"
                onClick={() => handleDocumentClick(doc)}
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
            ))
          ) : (
            <p className="no-documents">No tasks assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocalCard;