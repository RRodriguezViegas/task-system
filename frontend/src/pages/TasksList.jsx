import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

export default function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/tasks", {
        params: {
          page,
          limit,
          sortBy,
          order,
          status: statusFilter || undefined,
        },
      })
      .then(res => setTasks(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, [page, limit, sortBy, order, statusFilter]);

  if (loading)
    return <div className="p-4 text-gray-500">Cargando tareas...</div>;

  const handleCheck = async task => {
    const newStatus = task.status === "COMPLETED" ? "BACKLOG" : "COMPLETED";
    try {
      await axios.patch(`http://localhost:3000/tasks/${task.id}`, {
        status: newStatus,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar tarea");
    }
  };

  const handleDelete = async task => {
    if (!confirm("¿Seguro que querés borrar esta tarea?")) return;
    try {
      await axios.delete(`http://localhost:3000/tasks/${task.id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error al borrar tarea");
    }
  };

  const handleUpdateStatus = async (task, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/tasks/${task.id}`, {
        status: newStatus,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar estado");
    }
  };

  const handleUpdatePriority = async (task, newPriority) => {
    try {
      await axios.patch(`http://localhost:3000/tasks/${task.id}`, {
        priority: newPriority,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar prioridad");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex md:flex-row flex-col items-center justify-between mb-6">
        <h1 className="text-3xl font-bold ">Tasks list</h1>
        <div className="flex md:flex-row flex-col items-center gap-4">
          {/* Sorting */}
          <div className="flex md:flex-row flex-col items-center gap-1">
            <label className="text-sm">Sort by:</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              <option value="createdAt">Date</option>
              <option value="title">Title</option>
            </select>
            <select
              value={order}
              onChange={e => setOrder(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              <option value="asc">ASC</option>
              <option value="desc">DSC</option>
            </select>
          </div>

          {/* Filtering */}
          <div className="flex items-center gap-1">
            <label className="text-sm">Status:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              <option value="">All</option>
              <option value="BACKLOG">Backlog</option>
              <option value="UNSTARTED">Unstarted</option>
              <option value="STARTED">Started</option>
              <option value="CANCELED">Canceled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <TaskForm onTaskCreated={fetchTasks} />

      <ul className="space-y-2">
        {tasks.map(t => (
          <TaskItem
            key={t.id}
            task={t}
            onCheck={handleCheck}
            handleDelete={handleDelete}
            handleUpdateStatus={handleUpdateStatus}
            handleUpdatePriority={handleUpdatePriority}
            onClick={() => navigate(`/tasks/${t.id}`)}
          />
        ))}
      </ul>

      <div className="w-full flex md:flex-row flex-col items-center justify-between mt-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ◀
          </button>
          <span className="px-2">{page}</span>
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ▶
          </button>
        </div>
        <div className="flex items-center gap-1">
          <label className="text-sm">Tasks shown per page:</label>
          <select
            value={limit}
            onChange={e => setLimit(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
    </div>
  );
}
