import React from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./FocalCard.css";
import { FaUserCircle } from "react-icons/fa";
import { createSlug } from "../../utils/idGenerator";

const COLORS = ["#4CAF50", "#E53935", "#1E88E5"]; 

const FocalCard = ({ section, name, stats, documents, sectionId, id }) => {
  const navigate = useNavigate();

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
        section_designation: task.section_designation,
        section_name: task.sectionName,
        full_name: task.creator_name,
        task_status: task.task_status || "Ongoing"
      }
    });
  };

  return (
    <div className="focal-card">
      {/* Header → fixed navigation path */}
      <div 
        className="focal-header" 
        onClick={() => navigate(`/sections/${sectionId}/task/ongoing`)}
      >
        <FaUserCircle className="focal-avatar" />
        <div>
          <h3>{section}</h3>
          <p>{name}</p>
        </div>
      </div>

      {/* Body */}
      <div className="focal-body">
        {/* Donut Chart */}
        <div className="focal-chart">
          <h4 className="summary">Monthly Summary</h4>
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
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
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="focal-legend">
            <span><span className="legend-box complete"></span>Complete</span>
            <span><span className="legend-box past-due"></span>Past Due</span>
            <span><span className="legend-box pending"></span>Pending</span>
          </div>
        </div>

        {/* Document List */}
        <div className="focal-documents">
          {documents.map((doc, idx) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocalCard;