import React, { useState } from "react";
import axios from "axios";

export default function NewListForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    notes: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  // Simulated current user ID
  const userId = "6868";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch current user
      const userRes = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = userRes.data;

      // Create new list object
      const newList = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        quantity: formData.quantity,
        notes: formData.notes,
        image: formData.image,
        dateAdded: new Date().toLocaleDateString(),
        items: [],
      };

      // Append to user's shoppingLists
      const updatedUser = {
        ...user,
        shoppingLists: [...user.shoppingLists, newList],
      };

      await axios.put(`http://localhost:3000/users/${userId}`, updatedUser);

      alert("List added successfully!");
      setFormData({
        name: "",
        category: "",
        quantity: "",
        notes: "",
        image: "",
      });
    } catch (error) {
      console.error("Error adding list:", error);
      alert("Failed to add list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration custom-card">
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4 text-center">Add New List</h3>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      className="form-control form-control-lg"
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

                  <div className="mb-4">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      className="form-control form-control-lg"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Notes (optional)</label>
                    <textarea
                      name="notes"
                      className="form-control form-control-lg"
                      placeholder="Add any additional notes..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      className="form-control form-control-lg"
                      placeholder="https://example.com/item.jpg"
                      value={formData.image}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mt-4 pt-2 text-center">
                    <button
                      className="btn btn-success btn-lg"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save List"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
