import React, { useState } from "react";
import { useAppDispatch } from "../../reduxHooks";
import { addShoppingList } from "../features/shoppingListSlice";

interface ListsFormProps {
  onClose: () => void;
  userId: string;
}

export default function ListsForm({ onClose, userId }: ListsFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image: "",
  });

  const dispatch = useAppDispatch();

  // 🖼️ Default images per category
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
    Other:
      "https://images.unsplash.com/photo-1758978685891-877affc82ff4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hbnklMjBpdGVtcyUyMHBpY3VyZXxlbnwwfHwwfHx8MA%3D%3D", // default
  };

  // 🧠 Handle text input (name)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🧩 Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    const defaultImage =
      categoryImages[selectedCategory] || categoryImages["Other"];

    setFormData({
      ...formData,
      category: selectedCategory,
      image: defaultImage,
    });
  };

  // 🚀 Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      addShoppingList({
        ...formData,
        status: "",
        dateAdded: new Date(),
        userId: userId,
      })
    );
    onClose();
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
              {/* List Name */}
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

              {/* Category */}
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleCategoryChange}
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
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="mb-3 text-center">
                  <label className="form-label">Preview</label>
                  <img
                    src={formData.image}
                    alt="Category preview"
                    style={{
                      maxHeight: "180px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
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
