// Helper: Format date from ISO string to readable format
export const formatDate = (dateString) => {
  if (!dateString) return "No date";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Helper: Format time from ISO string
export const formatTime = (dateString) => {
  if (!dateString) return "No time";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid time";
  }
};

// Helper: Get weekday from date string
export const getWeekday = (dateStr) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("en-US", { weekday: "long" });
  } catch (error) {
    console.error("Error getting weekday:", error);
    return "";
  }
};

// Helper: Calculate completion stats based on schools_required and accounts_required
export const getTaskCompletionStats = (task) => {
  // Extract unique school names from schools_required
  const uniqueSchools = new Set(
    (task.schools_required || [])
      .map(school =>
        typeof school === "string"
          ? school.trim()
          : typeof school === "object" && school.school_name
            ? school.school_name.trim()
            : ""
      )
      .filter(name => name)
  );
  const totalAssigned = uniqueSchools.size;

  // Count unique schools in accounts_required with at least one "Completed" status
  const schoolsWithCompleted = new Set();
  task.accounts_required?.forEach(account => {
    if (
      account.status === "Completed" &&
      account.school_name &&
      uniqueSchools.has(account.school_name.trim())
    ) {
      schoolsWithCompleted.add(account.school_name.trim());
    }
  });

  return {
    total: totalAssigned,
    completed: schoolsWithCompleted.size,
  };
};

// Helper: Extract all ongoing tasks from taskData
export const getAllOngoingTasks = (taskData) => {
  const tasks = [];

  Object.keys(taskData).forEach(sectionId => {
    const sectionArray = taskData[sectionId];
    if (Array.isArray(sectionArray)) {
      sectionArray.forEach(focal => {
        focal.tasklist?.forEach(task => {
          if (task.task_status === "Ongoing") {
            tasks.push({
              ...task,
              sectionId,
              office: focal.office,
              section_designation: focal.section_designation,
              creator_name: focal.full_name,
              avatar: focal.avatar,
            });
          }
        });
      });
    }
  });

  // Sort by deadline (earliest first)
  return tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
};