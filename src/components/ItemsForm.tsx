import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { addItem } from "../features/itemSlice";

const categoryImages: Record<string, string> = {
  Food: "/images/food.png",
  Drinks: "/images/drinks.png",
  Fruits: "/images/fruits.png",
  Veggies: "/images/veggies.png",
  Appliances: "/images/appliances.png",
  Deodorant: "/images/deodorant.png",
  Lotion: "/images/lotion.png",
  Hair: "/images/hair.png",
  Shoes: "/images/shoes.png",
  Dresses: "/images/dresses.png",
  Tops: "/images/tops.png",
  Jerseys: "/images/jerseys.png",
  Bags: "/images/bags.png",
};

interface ItemsFormProps {
  listId: string;
}

export default function ItemsForm({ listId }: ItemsFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");

  const imagePreview = categoryImages[category];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch(
      addItem({
        name,
        quantity,
        notes,
        category,
        image: imagePreview,
        listId,
      })
    );

    // reset form
    setName("");
    setQuantity(1);
    setNotes("");
    setCategory("Food");
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-center">Add New Item</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Item name"
          className="border p-2 w-full rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 w-full rounded-md"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
        />

        <select
          className="border p-2 w-full rounded-md"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {Object.keys(categoryImages).map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {imagePreview && (
          <div className="flex justify-center">
            <img
              src={imagePreview}
              alt={category}
              className="h-20 w-20 object-contain"
            />
          </div>
        )}

        <textarea
          placeholder="Notes (optional)"
          className="border p-2 w-full rounded-md"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
