import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import FocalCard from "../../components/FocalCard/FocalCard";
import { Outlet } from "react-router-dom";
import { API_BASE_URL } from "../../api/api";
import { taskData } from "../../data/taskData";
import "./SectionPage.css";

const SectionPage = () => {
  const { sectionId } = useParams();
  const location = useLocation();
  const designations = taskData[sectionId];

  const [focalList, setFocalList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFocal, setSelectedFocal] = useState(null);

  const isInTaskRoute = location.pathname.startsWith(`/sections/${sectionId}/task/`);

  useEffect(() => {
    const fetchFocalData = async () => {
      try {
        const results = [];

        for (const designation of designations) {
          // Step 1: Fetch focal person info from /admin/office/section
          const res = await fetch(
            `${API_BASE_URL}/admin/office/section?section_designation=${encodeURIComponent(designation)}`
          );

          if (!res.ok) {
            // No user assigned → skip further requests
            results.push({
              section_designation: designation,
              name: "Not yet assigned",
              role: null,
              user_id: null,
              taskStatus: {},
              documents: [],
            });
            continue;
          }

          const data = await res.json();

          if (data && Array.isArray(data) && data.length > 0) {
            const focal = data[0];
            const fullName = `${focal.first_name} ${focal.middle_name ? focal.middle_name + " " : ""}${focal.last_name}`.trim();
            const userId = focal.user_id;

            let taskStatus = {};
            let assignmentsStatus = [];
            let documents = [];

            // ✅ ONLY IF user_id exists, fetch task stats and documents
            if (userId) {
              // Step 2: Fetch task statistics (for pie chart)
              const statsRes = await fetch(
                `${API_BASE_URL}/admin/recharts/task/data?user_id=${encodeURIComponent(userId)}`
              );
              if (statsRes.ok) {
                const statsData = await statsRes.json();
                console.log(`[API Response - Task Stats for user_id: ${userId}]`, statsData);

                const statusArray = statsData.task_status || [];
                const focalStats = statusArray[0] || {};

                taskStatus = {
                  Completed: focalStats.complete || 0,
                  Incomplete: focalStats.incomplete || 0,
                  Ongoing: focalStats.ongoing || 0,
                };

                assignmentsStatus = statsData.assignments_status || [];
              } else {
                console.warn(`Failed to fetch task stats for user_id: ${userId}`);
              }

              // Step 3: Fetch full task list (for documents)
              const docsRes = await fetch(
                `${API_BASE_URL}/admin/tasks/all/focal_id/?user_id=${encodeURIComponent(userId)}`
              );
              if (docsRes.ok) {
                documents = await docsRes.json();

                // ✅ Enrich documents with progress from assignmentsStatus
                documents = documents.map(doc => {
                  const assignment = assignmentsStatus.find(a => a.task_id === doc.task_id);

                  if (assignment) {
                    const { complete = 0, incomplete = 0 } = assignment;
                    const total = complete + incomplete;
                    const progress = total > 0 ? Math.round((complete / total) * 100) : 0;

                    return {
                      ...doc,
                      progress,
                    };
                  }

                  console.warn(`No progress data available for task_id: ${doc.id}`);
                  return {
                    ...doc,
                    progress: 0,
                  };
                });
              } else {
                console.warn(`Failed to fetch tasks for user_id: ${userId}`);
              }
            }

            results.push({
              section_designation: designation,
              name: fullName,
              role: focal.office,
              user_id: userId,
              taskStatus: taskStatus,
              documents: documents,
            });
          } else {
            // No user found → skip further requests
            results.push({
              section_designation: designation,
              name: "Not yet assigned",
              role: null,
              user_id: null,
              taskStatus: {},
              documents: [],
            });
          }
        }

        setFocalList(results);

        // Auto-select first valid focal (with user_id)
        if (results.length > 0 && !selectedFocal) {
          const firstValidFocal = results.find(r => r.user_id);
          if (firstValidFocal) {
            setSelectedFocal(firstValidFocal.user_id);
          }
        }
      } catch (err) {
        console.error("Error fetching focal data:", err);
        setError("Failed to load focal assignments.");
      }
    };

    if (designations) {
      fetchFocalData();
    }
  }, [sectionId, designations, selectedFocal]);

  if (error) return <div className="error">⚠️ {error}</div>;
  if (!designations) return <div>Invalid section ID</div>;

  return (
    <div className="focal-container">
      {!isInTaskRoute && (
        <>
          {focalList.map((focal, index) => {
            const stats = [
              { name: "Completed", value: focal.taskStatus.Completed || 0 },
              { name: "Incomplete", value: focal.taskStatus.Incomplete || 0 },
              { name: "Pending", value: focal.taskStatus.Ongoing || 0 },
            ];

            const isSelected = focal.user_id === selectedFocal;

            return (
              <FocalCard
                key={focal.user_id || `focal-${index}`}
                section={focal.section_designation}
                name={focal.name}
                stats={stats}
                documents={focal.documents}
                sectionId={sectionId}
                id={focal.user_id}
                isSelected={isSelected}
                onSelect={() => {
                  setSelectedFocal(focal.user_id);
                }}
              />
            );
          })}
        </>
      )}

      <Outlet context={{ selectedFocal }} />
    </div>
  );
};

export default SectionPage;