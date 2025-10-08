import React, { useState } from "react";
import { useAppDispatch } from "../../reduxHooks";
import { addShoppingList } from "../features/shoppingListSlice";

interface ListsFormProps {
  onClose: () => void;
  userId : string
}

export default function ListsForm({ onClose, userId }: ListsFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0].name });
    }
  };

  const dispatch = useAppDispatch();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addShoppingList({...formData, status:"", dateAdded:new Date(), userId:userId }))
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Add New List</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
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
                <label className="form-label">Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Save List
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
