import React, { useState } from "react";
import type { ShoppingLists } from "../features/shoppingListSlice";
import { useAppDispatch } from "../../reduxHooks";
import {
  deleteShoppingList,
  updateShoppingList,
} from "../features/shoppingListSlice";
import { useNavigate } from "react-router-dom";

interface Props {
  list: ShoppingLists;
}

export default function ListCard({ list }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Modal visibility
  const [showModal, setShowModal] = useState(false);

  // Editable fields
  const [editName, setEditName] = useState(list.name);
  const [editCategory, setEditCategory] = useState(list.category);
  const [editImage, setEditImage] = useState(list.image);

  // Default images per category
 const categoryImages: Record<string, string> = {
   Grocery:
     "https://media.istockphoto.com/id/1393629140/photo/empty-supermarket-aisle-with-refrigerators.jpg?s=1024x1024&w=is&k=20&c=WzzEh5lSSpAIqZ9ag2Mz3POyq0pFd5ErmCiLbsyeTJs=", // fruits/veggies
   School:
     "https://plus.unsplash.com/premium_photo-1663127354216-8d06d01b8775?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmFjayUyMHRvJTIwc2Nob29sJTIwcGljdXJlc3xlbnwwfHwwfHx8MA%3D%3D", // books
   Clothes:
     "https://media.istockphoto.com/id/955641488/photo/clothes-shop-costume-dress-fashion-store-style-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=bCfL1dwnhyDKOVYKhxF0E5I-R9x0Dr-mcncgqwjSliw=", // fashion
   Renovation:
     "https://media.istockphoto.com/id/1180990099/photo/paint-brush-and-open-paint-can-with-on-pastel-background-top-view-copy-space-appartment.webp?a=1&b=1&s=612x612&w=0&k=20&c=xVo8v0Ml6qaLTc_bZleEJzRdPeGhS2bkiQmPxoAFK_I=", // tools
   Cosmetics:
     "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29zbWV0aWN8ZW58MHx8MHx8fDA%3D", // makeup
   Party:
     "https://images.unsplash.com/photo-1661697522366-fa6c8dfb0e4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFydHklMjBwaWN1cmVzfGVufDB8fDB8fHww", // party balloons
   Supplies:
     "https://media.istockphoto.com/id/2167844412/photo/hand-worker-and-tablet-for-shipping-outdoor-for-cargo-crane-inventory-inspection-and-delivery.webp?a=1&b=1&s=612x612&w=0&k=20&c=SzETKQ8w_eKj2fh-Ob1eMjMxMxnBB74dfqhHfvAMJPI=", // stationery
   Ingredients:
     "https://media.istockphoto.com/id/2234343977/photo/chocolate-chip-cookies-with-recipe.webp?a=1&b=1&s=612x612&w=0&k=20&c=6Lo0LlvA3KGV7oYKE7ofjtv8IZfyiSpmxCI1GA8RmCg=", // food ingredients
 };

  if (!list || !list.name) return null;

  // Delete list
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this list and all its items?"
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

  // Handle category change in modal
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setEditCategory(selectedCategory);
    setEditImage(categoryImages[selectedCategory] || categoryImages["Other"]);
  };

  return (
    <>
      <div className="card shadow-lg h-100 border-0">
        <img
          src={
            list.image ||
            categoryImages[list.category] ||
            categoryImages["Other"]
          }
          alt={list.name}
          className="card-img-top"
          style={{
            height: "200px",
            objectFit: "cover",
            borderTopLeftRadius: "0.75rem",
            borderTopRightRadius: "0.75rem",
          }}
        />
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
          <button
            type="button" // important! prevents form submission
            className="btn btn-success mt-2"
            onClick={() => navigate("/items")}
          >
            View
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
                      onChange={handleCategoryChange}
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
