// src/pages/TaskPage.jsx
import { useMemo, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TaskTabs from "../../../components/TaskTabs/TaskTabs";
import { createSlug } from "../../../utils/idGenerator";
import { API_BASE_URL } from "../../../api/api";
import "./TaskPage.css";

const TaskPage = () => {
  // ✅ Declare ALL hooks first
  const [selectedSort, setSelectedSort] = useState("newest");
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  const isOfficeWithoutSection = currentUser?.role === "office" && (
    !currentUser.section_designation ||
    currentUser.section_designation === "Not specified" ||
    currentUser.section_designation === "" ||
    currentUser.section_designation === "NULL"
  );

  // ✅ Fetch assignments for a single task
  const fetchAssignmentsForTask = async (task_id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/focal/task/assignments?task_id=${encodeURIComponent(task_id)}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch assignments for task ${task_id}: ${response.statusText}`);
        return [];
      }

      return await response.json(); // Returns AssignedResponse[]
    } catch (err) {
      console.error(`Error fetching assignments for task ${task_id}:`, err);
      return [];
    }
  };

  // ✅ Enrich tasks with assignments
  const enrichTasksWithAssignments = async (rawTasks, token) => {
  const enrichedTasks = { ...rawTasks };

  for (const [sectionName, sections] of Object.entries(enrichedTasks)) {
    for (const section of sections) {
      for (const task of section.tasklist) {
        console.log(`BEFORE enrichment - Task: ${task.title}, Status: ${task.task_status}`); // 👈 ADD

        const assignments = await fetchAssignmentsForTask(task.task_id, token);
        console.log("📥 Assignments for task:", assignments); // 👈 ADD THIS

        const uniqueSchools = [...new Set(assignments.map(a => a.school_id))];

        task.schools_required = uniqueSchools;
        task.accounts_required = assignments;

        console.log(`AFTER enrichment - Task: ${task.title}, Status: ${task.task_status}`); // 👈 ADD
      }
    }
  }

  return enrichedTasks;
};

  // ✅ Fetch + enrich tasks
  useEffect(() => {
    const fetchAndEnrichTasks = async () => {
      console.log("🔄 Fetching tasks from backend..."); // <-- ADD THIS

      try {
        setLoading(true);
        const token = currentUser?.token;

        const response = await fetch(`${API_BASE_URL}/focal/tasks/all`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }

        const rawData = await response.json();
        console.log("📡 Raw tasks received:", rawData); // <-- ADD THIS

        const groupedBySection = rawData.reduce((acc, task) => {
          const sectionName = task.section || "General";
          if (!acc[sectionName]) {
            acc[sectionName] = [
              {
                section_name: sectionName,
                section_designation: sectionName,
                tasklist: [],
              },
            ];
          }
          acc[sectionName][0].tasklist.push(task);
          return acc;
        }, {});

        const enrichedTasks = await enrichTasksWithAssignments(groupedBySection, token);

        setTasks(enrichedTasks);
      } catch (err) {
        console.error("Error fetching and enriching tasks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Fetch immediately on mount
    fetchAndEnrichTasks();

    // ✅ Set up polling every 30 seconds
    const intervalId = setInterval(fetchAndEnrichTasks, 30_000); // 30 seconds

    // ✅ Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []); // <-- Keep empty dependency array

  // ✅ useMemo: called unconditionally
  const allOffices = useMemo(() => {
    return [
      ...new Set(
        Object.values(tasks)
          .flat()
          .flatMap((section) => section.tasklist.map((task) => task.office))
      ),
    ].sort();
  }, [tasks]);

  // ✅ useMemo: called unconditionally
  const { upcomingTasks, pastDueTasks, completedTasks } = useMemo(() => {
    console.log("🧮 Recalculating task categories..."); // <-- ADD THIS
    const upcoming = [];
    const pastDue = [];
    const completed = [];
    const now = new Date();

    Object.entries(tasks).forEach(([sectionName, sections]) => {
      sections.forEach((section) => {
        section.tasklist.forEach((task) => {
          const taskDeadline = new Date(task.deadline);
          const taskStatus = task.task_status || "ONGOING";

          console.log(`Task: ${task.title} | Status: ${taskStatus}`); // <-- LOG EACH TASK STATUS

          const taskDataObj = {
            id: task.creator_id,
            task_id: task.task_id,
            title: task.title,
            deadline: task.deadline,
            office: task.office,
            creation_date: task.creation_date,
            completion_date: task.completion_date || null,
            sectionId: sectionName,
            sectionName: sectionName,
            taskSlug: createSlug(task.title),
            creator_name: task.creator_name,
            description: task.description,
            task_status: taskStatus,
            section_designation: sectionName,
            schools_required: task.schools_required || [], // Now real school IDs
            accounts_required: task.accounts_required || [], // Now real assignments
            originalTask: task,
          };

          if (taskStatus === "COMPLETE") {
            completed.push({
              ...taskDataObj,
              completedTime: task.completion_date || task.modified_date || task.creation_date,
            });
          } else if (taskStatus === "INCOMPLETE") {
            pastDue.push(taskDataObj);
          } else if (taskDeadline < now) {
            pastDue.push(taskDataObj);
          } else {
            upcoming.push(taskDataObj);
          }
        });
      });
    });

    return { upcomingTasks: upcoming, pastDueTasks: pastDue, completedTasks: completed };
  }, [tasks]);

  // ✅ NOW return conditionally (after hooks)
  if (isOfficeWithoutSection) {
    return (
      <div className="no-section-page">
        <div className="no-section-container">
          <h2>⏳ Section Not Assigned Yet</h2>
          <p>Your account has not been assigned to a section by the administrator.</p>
          <p>Please wait for admin approval or contact support for assistance.</p>
          <p className="note">
            <strong>Note:</strong> You will not be able to view or manage tasks until your section is assigned.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <p>❌ Failed to load tasks: {error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Retry
        </button>
      </div>
    );
  }


  const sortTasks = (tasks, sortOption) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (sortOption) {
      case "newest":
        return [...tasks].sort(
          (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
        );
      case "oldest":
        return [...tasks].sort(
          (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
        );
      case "today":
        return tasks.filter((task) => {
          const taskDate = new Date(task.deadline);
          return (
            taskDate >= startOfDay &&
            taskDate < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
          );
        });
      case "week":
        return tasks.filter((task) => {
          const taskDate = new Date(task.deadline);
          const nextWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
          return taskDate >= startOfWeek && taskDate < nextWeek;
        });
      case "month":
        return tasks.filter((task) => {
          const taskDate = new Date(task.deadline);
          const nextMonth = new Date(
            startOfMonth.getFullYear(),
            startOfMonth.getMonth() + 1,
            1
          );
          return taskDate >= startOfMonth && taskDate < nextMonth;
        });
      default:
        return tasks;
    }
  };

  return (
    <div className="task-layout">
      <TaskTabs
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        showUpcomingIndicator={upcomingTasks.length > 0}
        showPastDueIndicator={pastDueTasks.length > 0}
        showCompletedIndicator={completedTasks.length > 0}
      />
      <Outlet
        context={{
          upcomingTasks: sortTasks(upcomingTasks, selectedSort),
          pastDueTasks: sortTasks(pastDueTasks, selectedSort),
          completedTasks: sortTasks(completedTasks, selectedSort),
          selectedSort,
          allOffices,
        }}
      />
    </div>
  );
};

export default TaskPage;