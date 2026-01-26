import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchItems } from "../features/itemSlice";
import ItemCard from "../components/ItemCard";
import ItemsForm from "../components/ItemsForm";

interface AddItemsPageProps {
  listId: string;
}

export default function AddItemsPage({ listId }: AddItemsPageProps) {
  const dispatch = useDispatch<AppDispatch>();

  dispatch(fetchItems(listId))
  const { items, loading } = useSelector(
    (state: RootState) => state.shoppingItems
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const categories = [
    "All",
    "Food",
    "Drinks",
    "Fruits",
    "Veggies",
    "Appliances",
    "Deodorant",
    "Lotion",
    "Hair",
    "Shoes",
    "Dresses",
    "Tops",
    "Jerseys",
    "Bags",
  ];

 useEffect(() => {
   if (listId) {
     dispatch(fetchItems(listId));
   }
 }, [dispatch, listId]);


  const filteredItems = items
    .filter((item) => item.listId === listId)
    .filter((item) =>
      categoryFilter === "All" ? true : item.category === categoryFilter
    )
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      <h2 className="text-2xl font-bold text-center mb-3">My List Items</h2>

      {/* Add New Item Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md"
        >
          + Add Item
        </button>
      </div>

      {/* Search + Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
        <input
          type="text"
          placeholder="Search items..."
          className="border p-2 rounded-md flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-2">
          <select
            className="border p-2 rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <button
            onClick={handleClearFilters}
            className="border border-gray-400 hover:bg-gray-100 rounded-md px-3 py-2 text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Loading and Empty States */}
      {loading && (
        <p className="text-center text-gray-500">Loading your items...</p>
      )}

      {!loading && filteredItems.length === 0 && (
        <p className="text-center text-gray-500">
          No items found. Click “Add Item” to create a new one 👆
        </p>
      )}

      {/* Item Cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-[400px] relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              Add a New Item
            </h3>

            <ItemsForm listId={listId} />

            <div className="text-center mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-600 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
