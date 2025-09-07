import { useState } from "react";
import axios from "axios";

export default function TaskForm({ onTaskCreated, parentId = null }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/tasks", {
        title,
        parentId,
      });
      setTitle("");
      if (onTaskCreated) onTaskCreated(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al crear la tarea");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={` rounded mb-6 ${
        parentId ? "bg-gray-200 mt-5" : "bg-gray-200"
      }`}
    >
      <input
        type="text"
        placeholder={
          parentId
            ? "Subtask title. Press Enter to save."
            : "Task title. Press Enter to save."
        }
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="rounded w-full p-2 font-light"
        required
      />
    </form>
  );
}
