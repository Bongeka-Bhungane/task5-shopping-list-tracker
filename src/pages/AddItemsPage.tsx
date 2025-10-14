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
  const { items, loading } = useSelector(
    (state: RootState) => state.shoppingItems
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

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

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      <h2 className="text-2xl font-bold text-center">My List Items</h2>

      {/* Add Item Form */}
      <ItemsForm listId={listId} />

      {/* Search + Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
        <input
          type="text"
          placeholder="Search items..."
          className="border p-2 rounded-md flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-2 rounded-md sm:w-40"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Loading and Empty States */}
      {loading && (
        <p className="text-center text-gray-500">Loading your items...</p>
      )}

      {!loading && filteredItems.length === 0 && (
        <p className="text-center text-gray-500">
          No items match your search or filter. Try adding a new one above 👆
        </p>
      )}

      {/* Item Cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
