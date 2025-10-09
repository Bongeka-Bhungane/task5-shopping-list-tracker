import React, { useState } from "react";
import type { ShoppingLists } from "../features/shoppingListSlice";
import { useAppDispatch } from "../../reduxHooks";
import {
  deleteShoppingList,
  updateShoppingList,
} from "../features/shoppingListSlice";

interface Props {
  list: ShoppingLists;
}

export default function ListCard({ list }: Props) {
  const dispatch = useAppDispatch();

  // Modal visibility
  const [showModal, setShowModal] = useState(false);

  // Editable fields
  const [editName, setEditName] = useState(list.name);
  const [editCategory, setEditCategory] = useState(list.category);
  const [editImage, setEditImage] = useState(list.image);

  if (!list || !list.name) return null;

  // Delete list
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this list and all its list?"
    );
    if (confirmDelete) {
      await dispatch(deleteShoppingList(id));
    }
  };

  // Update list
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedList = {
      ...list,
      name: editName,
      category: editCategory,
      image: editImage,
    };

    await dispatch(updateShoppingList(updatedList));
    setShowModal(false);
  };

  return (
    <>
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
            className="btn btn-warning mt-2 me-2"
            onClick={() => setShowModal(true)}
          >
            Edit
          </button>

          <button
            className="btn btn-danger mt-2"
            onClick={() => handleDelete(list.id!)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* --- Modal for editing --- */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdate}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Shopping List</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">List Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      required
                    >
                      <option value="">Select new category</option>
                      <option value="Grocery">Grocery</option>
                      <option value="School">School</option>
                      <option value="Clothes">Clothes</option>
                      <option value="Renovation">Renovation</option>
                      <option value="Cosmetics">Cosmetics</option>
                      <option value="Party">Party</option>
                      <option value="Supplies">Supplies</option>
                      <option value="Ingredients">Ingredients</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
