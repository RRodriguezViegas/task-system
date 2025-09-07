import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editFields, setEditFields] = useState({});
  const [timer, setTimer] = useState(null);
  const navigate = useNavigate();

  const fetchTask = async () => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/tasks/${id}`)
      .then(res => {
        setTask(res.data);
        setEditFields({
          title: res.data.title || "",
          description: res.data.description || "",
          status: res.data.status || "BACKLOG",
          priority: res.data.priority || "",
          estimate: res.data.estimate || 0,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleChange = (field, value) => {
    setEditFields(prev => ({ ...prev, [field]: value }));

    if (timer) clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          await axios.patch(`http://localhost:3000/tasks/${task.id}`, {
            [field]: value,
          });
          setTask(prev => ({ ...prev, [field]: value }));
        } catch (err) {
          console.error(err);
        }
      }, 1000)
    );
  };

  const handleCheck = async task => {
    const newStatus = task.status === "COMPLETED" ? "BACKLOG" : "COMPLETED";
    try {
      await axios.patch(`http://localhost:3000/tasks/${task.id}`, {
        status: newStatus,
      });
      fetchTask();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar tarea");
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm("¿Seguro que querés borrar esta tarea?")) return;
    try {
      await axios.delete(`http://localhost:3000/tasks/${task.id}`);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error al borrar tarea");
    }
  };

  const handleDeleteSubtask = async sub => {
    if (!confirm("¿Seguro que querés borrar esta subtarea?")) return;
    try {
      await axios.delete(`http://localhost:3000/tasks/${sub.id}`);
      fetchTask();
    } catch (err) {
      console.error(err);
      alert("Error al borrar subtarea");
    }
  };

  const handleUpdateStatusSubtask = async (sub, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/tasks/${sub.id}`, {
        status: newStatus,
      });
      fetchTask();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar subtarea");
    }
  };

  const handleUpdatePrioritySubtask = async (sub, newPriority) => {
    try {
      await axios.patch(`http://localhost:3000/tasks/${sub.id}`, {
        priority: newPriority,
      });
      fetchTask();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar subtarea");
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (!task) return <div className="p-4 text-gray-500">Task not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-600 hover:underline inline-block transition duration-300"
        >
          ← Back to list
        </Link>
        <button
          onClick={handleDeleteTask}
          className=" text-red-500 px-3 py-1 cursor-pointer rounded hover:bg-red-50 transition duration-300"
        >
          Delete
        </button>
      </div>

      <input
        value={editFields.title}
        onChange={e => handleChange("title", e.target.value)}
        className="w-full text-2xl font-bold mb-4 border-b-2 border-transparent focus:outline-none focus:border-blue-400 transition duration-300 "
      />

      {/* Fecha de creación y última actualización y UNIQUE ID */}
      <div className="flex space-x-6 items-center text-sm text-gray-500 mb-2">
        <div>
          <span className="font-semibold">Unique ID:</span> {task.id}
        </div>
        <div>
          <span className="font-semibold">Created:</span>{" "}
          {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}
        </div>
        <div>
          <span className="font-semibold">Updated:</span>{" "}
          {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "-"}
        </div>
      </div>

      <textarea
        value={editFields.description}
        onChange={e => handleChange("description", e.target.value)}
        placeholder="Description"
        className="w-full h-40 rounded border p-2 border-gray-300 focus:outline-none focus:border-blue-400 transition duration-300"
      />

      <div className="flex md:flex-row space-y-4 flex-col space-x-4 mb-4">
        <div>
          <label className="font-semibold">Status:</label>
          <select
            value={editFields.status}
            onChange={e => handleChange("status", e.target.value)}
            className="ml-2 bg-white text-gray-800 border border-gray-400 rounded p-1"
          >
            <option value="BACKLOG">Backlog</option>
            <option value="UNSTARTED">Unstarted</option>
            <option value="STARTED">Started</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Priority:</label>
          <select
            value={editFields.priority}
            onChange={e => handleChange("priority", e.target.value)}
            className="ml-2 border rounded border-gray-400 p-1"
          >
            <option value="">-</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Estimado:</label>
          <input
            type="number"
            value={editFields.estimate}
            onChange={e => handleChange("estimate", Number(e.target.value))}
            min="0"
            className="ml-2 w-20 border border-gray-400 rounded p-1"
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Subtasks</h2>
      {(() => {
        const totalSubtasks = task.subtasks.length;
        const backlogUnstarted = task.subtasks.filter(
          s => s.status === "BACKLOG" || s.status === "UNSTARTED"
        ).length;
        const started = task.subtasks.filter(
          s => s.status === "STARTED"
        ).length;
        return (
          <div className="text-sm text-gray-600 mb-2">
            Total: {totalSubtasks} | Pending: {backlogUnstarted} | In progress:{" "}
            {started}
          </div>
        );
      })()}
      {task.subtasks.length === 0 ? (
        <p className="text-gray-500">No subtasks</p>
      ) : (
        <ul>
          {task.subtasks.map(sub => (
            <TaskItem
              key={sub.id}
              task={sub}
              onCheck={handleCheck}
              handleDelete={handleDeleteSubtask}
              handleUpdateStatus={handleUpdateStatusSubtask}
              handleUpdatePriority={handleUpdatePrioritySubtask}
              onClick={() => navigate(`/tasks/${sub.id}`)}
            />
          ))}
        </ul>
      )}

      <TaskForm
        parentId={task.id}
        onTaskCreated={newSubtask =>
          setTask(prev => ({
            ...prev,
            subtasks: [...prev.subtasks, newSubtask],
          }))
        }
      />
    </div>
  );
}
