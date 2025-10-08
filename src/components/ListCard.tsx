import React from "react";
import type { ShoppingLists } from "../features/shoppingListSlice";

interface Props {
  list: ShoppingLists;
  onDelete: () => void;
}

export default function ListCard({ list, onDelete }: Props) {
  if (!list || !list.listName) return null; // skip invalid objects

  return (
    <div className="card shadow-lg h-100 border-0">
      {list.image && (
        <img
          src={list.image}
          alt={list.listName}
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
        <h5 className="card-title">{list.listName}</h5>
        <p className="card-text">
          <strong>Category:</strong> {list.category}
        </p>
        <p className="card-text">
          <strong>Items:</strong> {list.items?.length || 0}
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
          <strong>Date Added:</strong> {list.dateAdded}
        </p>
        <button className="btn btn-danger mt-2" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
