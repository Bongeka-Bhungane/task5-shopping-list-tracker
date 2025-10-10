import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { addItem } from "../features/itemSlice";
import type { Item } from "../features/itemSlice";
import axios from "axios";

const defaultCategoryImages: Record<string, string> = {
  food: "https://via.placeholder.com/150?text=Food",
  dairy: "https://via.placeholder.com/150?text=Dairy",
  drinks: "https://via.placeholder.com/150?text=Drinks",
  fruits: "https://via.placeholder.com/150?text=Fruits",
  veggies: "https://via.placeholder.com/150?text=Veggies",
  appliances: "https://via.placeholder.com/150?text=Appliances",
  deodorant: "https://via.placeholder.com/150?text=Deodorant",
  lotion: "https://via.placeholder.com/150?text=Lotion",
  hair: "https://via.placeholder.com/150?text=Hair",
  shoes: "https://via.placeholder.com/150?text=Shoes",
  dresses: "https://via.placeholder.com/150?text=Dresses",
  tops: "https://via.placeholder.com/150?text=Tops",
  jerseys: "https://via.placeholder.com/150?text=Jerseys",
  bags: "https://via.placeholder.com/150?text=Bags",
};

export default function ItemsForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [activeListId, setActiveListId] = useState<string>("");
  const [formData, setFormData] = useState<Omit<Item, "id">>({
    name: "",
    quantity: 1,
    notes: "",
    category: "",
    image: "",
    listId: "",
  });

  // 🔹 Fetch the active shopping list automatically
  useEffect(() => {
    const fetchActiveList = async () => {
      try {
        const res = await axios.get("http://localhost:3000/lists");
        if (res.data.length > 0) {
          const latestList = res.data[res.data.length - 1]; // get the most recent list
          setActiveListId(latestList.id);
          setFormData((prev) => ({ ...prev, listId: latestList.id }));
        }
      } catch (error) {
        console.error("Error fetching list:", error);
      }
    };
    fetchActiveList();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const val = name === "quantity" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
      ...(name === "category"
        ? { image: defaultCategoryImages[value] || "" }
        : {}),
    }));
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !activeListId) {
      alert("Please ensure all fields are filled and a list is active.");
      return;
    }

    dispatch(addItem({ ...formData, listId: activeListId }))
      .unwrap()
      .then(() => {
        alert("Item added successfully!");
        setFormData({
          name: "",
          quantity: 1,
          notes: "",
          category: "",
          image: "",
          listId: activeListId,
        });
      })
      .catch((err) => {
        alert("Error adding item: " + err);
      });
  };

  return (
    <div
      className="card shadow-lg p-4 mt-4 mx-auto"
      style={{ maxWidth: "500px" }}
    >
      <h4 className="card-title text-center mb-4">Add New Item</h4>

      {activeListId ? (
        <form onSubmit={handleSubmit}>
          {/* Item Name */}
          <div className="mb-3">
            <label htmlFor="itemName" className="form-label">
              Item Name
            </label>
            <input
              type="text"
              className="form-control"
              id="itemName"
              name="name"
              placeholder="Enter item name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Quantity */}
          <div className="mb-3">
            <label htmlFor="itemQuantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              className="form-control"
              id="itemQuantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <input
              type="text"
              className="form-control"
              id="notes"
              name="notes"
              placeholder="Optional notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label htmlFor="itemCategory" className="form-label">
              Category
            </label>
            <select
              className="form-select"
              id="itemCategory"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Choose...</option>
              {Object.keys(defaultCategoryImages).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Image Preview */}
          {formData.image && (
            <div className="text-center mb-3">
              <img
                src={formData.image}
                alt={formData.category}
                className="img-fluid rounded shadow"
                style={{ maxHeight: "150px" }}
              />
              <p className="mt-2 text-muted">Preview for {formData.category}</p>
            </div>
          )}

          <button type="submit" className="btn btn-success w-100">
            Add Item
          </button>
        </form>
      ) : (
        <p className="text-center text-muted">Loading your shopping list...</p>
      )}
    </div>
  );
}
