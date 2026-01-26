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
  const [updatedQty, setUpdatedQty] = useState(item.quantity);
  const [done, setDone] = useState(false); // local only, can be updated to backend if needed

  const handleDelete = () => dispatch(deleteItem(item.id));

  const handleUpdate = () => {
    dispatch(updateItem({ ...item, name: updatedName, quantity: updatedQty }));
    setEditing(false);
  };

  const toggleDone = () => {
    setDone(!done);
    // Optional: update backend
    // dispatch(updateItem({ ...item, done: !done }));
  };

  return (
    <div className="border rounded-xl p-4 shadow-md bg-white flex items-center gap-4 hover:shadow-lg transition-shadow">
      <input
        type="checkbox"
        checked={done}
        onChange={toggleDone}
        className="h-5 w-5"
      />

      <img
        src={item.image}
        alt={item.category}
        className="h-16 w-16 object-contain rounded-lg"
      />

      <div className="flex-1">
        {editing ? (
          <>
            <input
              className="border p-1 rounded-md w-full mb-1"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <input
              type="number"
              className="border p-1 rounded-md w-20"
              value={updatedQty}
              min={1}
              onChange={(e) => setUpdatedQty(Number(e.target.value))}
            />
          </>
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
          {item.category} | Qty: {updatedQty}
        </p>
        {item.notes && <p className="text-xs italic">{item.notes}</p>}
      </div>

      <div className="flex gap-2 flex-col md:flex-row">
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
