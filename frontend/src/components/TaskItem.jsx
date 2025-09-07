import { useState } from "react";

export default function TaskItem({
  task,
  onCheck,
  onClick,
  handleDelete,
  handleUpdateStatus,
  handleUpdatePriority,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  return (
    <li
      className="relative border border-gray-300 rounded p-4 flex flex-col hover:bg-gray-200 cursor-pointer transition duration-100"
      onClick={onClick}
    >
      <div className="flex items-center flex-1 min-w-0">
        <input
          type="checkbox"
          className="mr-4 flex-shrink-0"
          checked={task.status === "COMPLETED"}
          onClick={e => {
            e.stopPropagation();
            onCheck(task);
          }}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className={`font-semibold ${
              task.status === "COMPLETED" ? "line-through" : ""
            } truncate`}
          >
            {task.title}
          </span>
          {task.description && (
            <span className="text-sm text-gray-700 my-2 flex-1 min-w-0">
              {task.description}
            </span>
          )}
          <div className="text-xs text-gray-600 mt-1 space-x-2">
            <span>ID: {task.id}</span>
            <span>| Status: {task.status}</span>
            {task.priority && <span>| Priority: {task.priority}</span>}
            {task.estimate !== undefined && (
              <span>| Estimate: {task.estimate}</span>
            )}
            {task.createdAt && (
              <span>
                | Created: {new Date(task.createdAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {/* Botón de opciones */}
          <div className="relative flex-shrink-0">
            <button
              onClick={e => {
                e.stopPropagation();
                setOpenMenu(openMenu === task.id ? null : task.id);
              }}
              className="px-2 py-1 text-gray-600 hover:text-black"
            >
              ⋮
            </button>
            {openMenu === task.id && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-400 rounded shadow-md z-10">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(task);
                    setOpenMenu(null);
                  }}
                  className="block w-full text-red-600 text-left px-3 py-2 hover:bg-red-50"
                >
                  Delete
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleUpdateStatus(task, "CANCELED");
                    setOpenMenu(null);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  Won't do
                </button>
                <div className="border-t" />
                {["Low", "Medium", "High", "Urgent"].map(p => (
                  <button
                    key={p}
                    onClick={e => {
                      e.stopPropagation();
                      handleUpdatePriority(task, p);
                      setOpenMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-2 ${
                      p === "Low"
                        ? "bg-green-100 hover:bg-green-200"
                        : p === "Medium"
                        ? "bg-yellow-100 hover:bg-yellow-200"
                        : p === "High"
                        ? "bg-orange-100 hover:bg-orange-200"
                        : p === "Urgent"
                        ? "bg-red-100 hover:bg-red-200"
                        : ""
                    }`}
                  >
                    Priority: {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
