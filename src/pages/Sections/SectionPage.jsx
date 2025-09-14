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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFocal, setSelectedFocal] = useState(null);

  const isInTaskRoute = location.pathname.startsWith(`/sections/${sectionId}/task/`);

  useEffect(() => {
    if (!designations || designations.length === 0) {
      setLoading(false);
      return;
    }

    const fetchFocalData = async () => {
      try {
        const results = [];

        for (const designation of designations) {
          // Step 1: Fetch focal person info from /admin/office/section
          const res = await fetch(
            `${API_BASE_URL}/admin/office/section?section_designation=${encodeURIComponent(designation)}`
          );

          if (!res.ok) {
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

            // Step 2: Fetch task statistics (for pie chart)
            if (userId) {
              const statsRes = await fetch(
                `${API_BASE_URL}/admin/recharts/task/data?user_id=${encodeURIComponent(userId)}`
              );
              if (statsRes.ok) {
                const statsData = await statsRes.json();

                // Extract task status for pie chart
                const statusArray = statsData.task_status || [];
                const focalStats = statusArray[0] || {};

                taskStatus = {
                  Completed: focalStats.complete || 0,
                  Incomplete: focalStats.incomplete || 0,
                  Ongoing: focalStats.ongoing || 0,
                };

                // Extract assignments_status for per-task progress calculation
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

                // ✅ ENRICH DOCUMENTS WITH PROGRESS FROM assignments_status
                documents = documents.map(doc => {
                  // Find matching assignment by task_id
                  const assignment = assignmentsStatus.find(a => a.task_id === doc.id);

                  if (assignment) {
                    const { complete, incomplete } = assignment;
                    const total = complete + incomplete;

                    // Avoid division by zero
                    const progress = total > 0 ? Math.round((complete / total) * 100) : 0;

                    return {
                      ...doc,
                      progress, // ✅ Inject computed progress
                    };
                  }

                  // If no assignment found, fallback to default based on task_status
                  let fallbackProgress = 0;
                  switch (doc.task_status) {
                    case "COMPLETE":
                      fallbackProgress = 100;
                      break;
                    case "ONGOING":
                      fallbackProgress = 50;
                      break;
                    case "INCOMPLETE":
                    default:
                      fallbackProgress = 0;
                  }

                  return {
                    ...doc,
                    progress: fallbackProgress,
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
              documents: documents, // ✅ Now enriched with dynamic progress!
            });
          } else {
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

        console.log("✅ Final focal list:", results);

        setFocalList(results);

        // Auto-select first valid focal
        if (results.length > 0 && !selectedFocal) {
          const firstValidFocal = results.find(r => r.user_id);
          if (firstValidFocal) {
            setSelectedFocal(firstValidFocal.user_id);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching focal ", err);
        setError("Failed to load focal assignments.");
        setLoading(false);
      }
    };

    fetchFocalData();
  }, [sectionId, designations]);

  if (error) return <div className="error">⚠️ {error}</div>;
  if (!designations) return <div>Invalid section ID</div>;

  // ✅ RENDER LOADING SPINNER WHILE LOADING
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="focal-container">
      {!isInTaskRoute && (
        <>
          {focalList.map((focal, index) => {
            const stats = [
              { name: "Completed", value: focal.taskStatus.Completed },
              { name: "Incomplete", value: focal.taskStatus.Incomplete },
              { name: "Pending", value: focal.taskStatus.Ongoing },
            ];

            console.log(`📊 Stats for ${focal.name}:`, stats);
            console.log(`📄 Documents for ${focal.name}:`, focal.documents);

            const isSelected = focal.user_id === selectedFocal;

            return (
              <FocalCard
                key={focal.user_id || `focal-${index}`}
                section={focal.section_designation}
                name={focal.name}
                stats={stats}
                documents={focal.documents} // ✅ Now includes calculated progress!
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