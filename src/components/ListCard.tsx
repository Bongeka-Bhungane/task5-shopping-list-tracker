import React from "react";
import type { ShoppingLists } from "../features/shoppingListSlice";
import { useAppDispatch } from "../../reduxHooks";
import { deleteShoppingList } from "../features/shoppingListSlice";

interface Props {
  list: ShoppingLists;
}

export default function ListCard({ list }: Props) {
  const dispatch = useAppDispatch();
  if (!list || !list.name) return null; // skip invalid objects

  // Delete a list (with confirmation)
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this list and all its list?"
    );
    if (confirmDelete) {
      await dispatch(deleteShoppingList(id)); // :white_check_mark: backend delete
    }
  };

  return (
    <div className="card shadow-lg h-100 border-0">
      {list.image && (
        <img
          src={list.image}
          alt={list.name}
          className="card-img-top"
          style={{
            height: "200px",
            objectFit: "cover",
            borderTopLeftRadius: "0.75rem",
            borderTopRightRadius: "0.75rem",
          }}
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{list.name}</h5>
        <p className="card-text">
          <strong>Category:</strong> {list.category}
        </p>
        <p className="card-text">
          <strong>Items:</strong> {list.quantity || 0}
        </p>
        <p className="card-text">
          <strong>Status:</strong>{" "}
          <span
            className={`badge ${
              list.status === "Completed"
                ? "bg-success"
                : list.status === "In Progress"
                ? "bg-warning text-dark"
                : "bg-danger"
            }`}
          >
            {list.status}
          </span>
        </p>
        <p className="card-text">
          <strong>Date Added:</strong> {list.dateAdded.toString()}
        </p>
        <button
          className="btn btn-danger mt-2"
          onClick={() => handleDelete(list.id!)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
