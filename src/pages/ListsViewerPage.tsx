import React, { useEffect, useState } from "react";
import axios from "axios";

interface List {
  id: number;
  name: string;
  category: string;
  image: string;
  status: string;
  dateAdded: string;
  items: [];
}

export default function ViewLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    image: "",
    status: "",
  });

  const userId = "6868";

  const fetchLists = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/users/${userId}`);
      setLists(res.data.shoppingLists || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userRes = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = userRes.data;

      const newList = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        quantity: formData.quantity,
        image: formData.image,
        status: formData.status || "Not Started",
        dateAdded: new Date().toLocaleDateString(),
        items: [],
      };

      const updatedUser = {
        ...user,
        shoppingLists: [...user.shoppingLists, newList],
      };

      await axios.put(`http://localhost:3000/users/${userId}`, updatedUser);

      setFormData({
        name: "",
        category: "",
        quantity: "",
        image: "",
        status: "",
      });
      setShowModal(false);
      fetchLists();
      alert("List added successfully!");
    } catch (error) {
      console.error("Error adding list:", error);
      alert("Failed to add list");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this list?")) return;

    try {
      const userRes = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = userRes.data;

      const updatedLists = user.shoppingLists.filter(
        (list: List) => list.id !== id
      );

      const updatedUser = { ...user, shoppingLists: updatedLists };

      await axios.put(`http://localhost:3000/users/${userId}`, updatedUser);
      fetchLists();
    } catch (error) {
      console.error("Failed to delete list:", error);
      alert("Error deleting list");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading lists...</p>;

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Shopping Lists</h2>
        <button
          className="btn btn-success btn-lg"
          onClick={() => setShowModal(true)}
        >
          + Add New List
        </button>
      </div>

      {/* IF NO LISTS */}
      {lists.length === 0 ? (
        <div className="text-center mt-5">
          <h3>No shopping lists yet</h3>
          <p className="text-muted">Start by adding your first list!</p>
        </div>
      ) : (
        <div className="row">
          {lists.map((list) => (
            <div key={list.id} className="col-12 col-md-6 col-lg-4 mb-4">
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
                          : "bg-secondary"
                      }`}
                    >
                      {list.status}
                    </span>
                  </p>
                  <p className="card-text">
                    <strong>Date Added:</strong> {list.dateAdded}
                  </p>
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => handleDelete(list.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
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
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddList}>
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
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-control"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select status</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
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
                  <button type="submit" className="btn btn-success">
                    Save List
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
