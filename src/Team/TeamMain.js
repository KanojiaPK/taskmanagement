import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

// Utility function to format the date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" }; 
  return new Date(dateString).toLocaleDateString(undefined, options); 
};

const TeamMain = () => {
  const navigate = useNavigate(); 
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newDocument, setNewDocument] = useState(null);
  const [error, setError] = useState("");

  const statuses = ["To do", "In Progress", "Done"];
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user?._id;

  const getNextStatus = (currentStatus) => {
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  // Fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8003/api/v1/todo/get-todos"
      );

      if (response.status === 200 && Array.isArray(response.data.data)) {
        const userTasks = userId
          ? response.data.data.filter((task) => task.user === userId)
          : [];
        setTasks(userTasks);
      } else {
        setError("Unexpected response format. Please contact support.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Could not fetch tasks. Please try again later.");
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      setError("Task title is required.");
      return;
    }
    const formData = new FormData();
    formData.append("task", newTaskTitle);
    formData.append("status", "To Do");
    formData.append("due_date", newDueDate);
    formData.append("user", userId);

    if (newImage) formData.append("image", newImage);
    if (newDocument) formData.append("document", newDocument);

    try {
      const response = await axios.post(
        "http://localhost:8003/api/v1/todo/add-Todo",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        fetchTasks();
        setNewTaskTitle("");
        setNewDueDate("");
        setNewImage(null);
        setNewDocument(null);
        setError("");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Could not add task. Please try again.");
    }
  };

  // Delete a task
  const handleRemoveTask = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:8003/api/v1/todo/delete-Todo/${taskId}`
      );

      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);

      if (updatedTasks.length === 0) {
        setError("No tasks available. Please add a task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Could not delete task. Please try again.");
    }
  };

  // Update task status
  const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = getNextStatus(currentStatus);
    const formData = new FormData();
    formData.append("status", newStatus);

    try {
      const response = await axios.put(
        `http://localhost:8003/api/v1/todo/edit-Todo/${taskId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Could not update task status. Please try again.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userData"); // Clear user data from local storage
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center">Team Dashboard</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}

      <div className="mb-4 text-right">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-500 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New Task Title"
          className="p-2 mr-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="p-2 mr-2 border border-gray-300 rounded"
        />
        <label className="p-2 mr-2 text-white bg-blue-500 rounded cursor-pointer">
          Add Image
          <input
            type="file"
            onChange={(e) => setNewImage(e.target.files[0])}
            className="hidden"
          />
        </label>
        <label className="p-2 mr-2 text-white bg-blue-500 rounded cursor-pointer">
          Add Document
          <input
            type="file"
            onChange={(e) => setNewDocument(e.target.files[0])}
            className="hidden"
          />
        </label>
        <button
          onClick={handleAddTask}
          className="px-4 py-2 text-white bg-green-500 rounded"
        >
          Add Task
        </button>
      </div>

      <div className="flex justify-between">
        {tasks.length === 0 ? (
          <div className="w-full p-4 text-center bg-white rounded shadow-md">
            <p className="text-gray-500">
              No tasks available. Please add a task.
            </p>
          </div>
        ) : (
          statuses.map((status) => (
            <div key={status} className="w-1/3 p-4 bg-white rounded shadow-md">
              <h2 className="mb-4 text-xl font-bold">{status}</h2>
              <div>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div
                      key={task._id}
                      className="p-2 mb-2 bg-gray-200 rounded shadow"
                    >
                      <p>{task.task}</p>
                      <p>
                        Due Date:{" "}
                        {task.due_date ? formatDate(task.due_date) : "N/A"}
                      </p>{" "}
                      {/* Format due date */}
                      {task.image && (
                        <img
                          src={`http://localhost:8003/uploads/${task.image}`}
                          alt="Task"
                          className="object-contain w-full mt-2 max-h-32"
                        />
                      )}
                      {task.document && (
                        <a
                          href={`http://localhost:8003/uploads/${task.document}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          View Document
                        </a>
                      )}
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() =>
                            handleStatusChange(task._id, task.status)
                          }
                          className="px-2 py-1 text-white bg-blue-500 rounded"
                        >
                          Move to Next
                        </button>
                        <button
                          onClick={() => handleRemoveTask(task._id)}
                          className="px-2 py-1 text-white bg-red-500 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamMain;
