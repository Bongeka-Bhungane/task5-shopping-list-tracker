import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { deleteItem, updateItem } from "../features/itemSlice";
import type { Items } from "../features/itemSlice";

interface ItemCardProps {
  item: Items;
}

export default function ItemCard({ item }: ItemCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [editing, setEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState(item.name);
  const [done, setDone] = useState(false);

  const handleDelete = () => {
    dispatch(deleteItem(item.id));
  };

  const handleUpdate = () => {
    dispatch(updateItem({ ...item, name: updatedName }));
    setEditing(false);
  };

  const toggleDone = () => setDone(!done);

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-gray-50 flex items-center justify-between gap-4">
      <input type="checkbox" checked={done} onChange={toggleDone} />
      <img
        src={item.image}
        alt={item.category}
        className="h-16 w-16 object-contain"
      />

      <div className="flex-1">
        {editing ? (
          <input
            className="border p-1 rounded-md w-full"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
        ) : (
          <p
            className={`font-semibold ${
              done ? "line-through text-gray-400" : ""
            }`}
          >
            {item.name}
          </p>
        )}
        <p className="text-sm text-gray-500">
          {item.category} | Qty: {item.quantity}
        </p>
        {item.notes && <p className="text-xs italic">{item.notes}</p>}
      </div>

      <div className="flex flex-col gap-2">
        {editing ? (
          <button
            className="text-sm text-green-600 hover:text-green-800"
            onClick={handleUpdate}
          >
            Save
          </button>
        ) : (
          <button
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
        <button
          className="text-sm text-red-600 hover:text-red-800"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
