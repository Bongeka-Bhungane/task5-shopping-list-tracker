import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { addItem } from "../features/itemSlice";

const categoryImages: Record<string, string> = {
  Food: "https://www.nicepng.com/png/detail/284-2849523_grocery-items-png-online-grocery-store-online-grocery.pnghttps://www.nicepng.com/png/detail/284-2849523_grocery-items-png-online-grocery-store-online-grocery.png",
  Drinks:
    "https://vinut.com.vn/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2023/12/the-top-5-biggest-beverage-companies-in-the-world-6573ca45677ca.jpg.webp",
  Fruits:
    "https://img.freepik.com/free-photo/mixed-fruits-with-apple-banana-orange-other_74190-938.jpg",
  Veggies:
    "https://media.istockphoto.com/id/157732986/photo/fresh-vegetables.jpg?b=1&s=612x612&w=0&k=20&c=VBDUrq9aPevbA8HvNVckxn0hcM-PuSwtlHlY4OlZSE0=",
  Appliances:
    "https://media.istockphoto.com/id/1211554164/photo/3d-render-of-home-appliances-collection-set.jpg?s=612x612&w=0&k=20&c=blm3IyPyZo5ElWLOjI-hFMG-NrKQ0G76JpWGyNttF8s=",
  Deodorant:
    "https://www.shutterstock.com/image-photo/closeup-view-woman-blue-tank-600nw-2503283243.jpg",
  Lotion:
    "https://cdn.shopify.com/s/files/1/0007/9711/4434/files/Asset_142_medium.png?v=1597786727",
  Hair: "https://i.pinimg.com/236x/28/5c/8b/285c8b2c531f0b35dd041f9d31fc4e40.jpg",
  Shoes:
    "https://media.istockphoto.com/id/1459477622/photo/organization-shelves-with-shoes-organized-and-lined-up.jpg?s=612x612&w=0&k=20&c=Xy_bUOcS6p3iHFTeatoafllbINJTgBkEUrPWs-rcUGg=",
  Dresses:
    "https://i.pinimg.com/736x/2b/8b/79/2b8b797be3820538133c3630adeb0c94.jpg",
  Tops: "https://media.istockphoto.com/id/1368096175/photo/young-woman-choosing-clothes.jpg?s=612x612&w=0&k=20&c=tU29GCL9H6HDbgvIxaaaccPjLJ4Dw35P-64TpNyxWEU=",
  Jerseys:
    "https://www.cleanipedia.com/images/7a81sg4qctqh/7D3Onn5hrAbc6GsQraEvjh/b24eb84eb25295a13d8cad884ffa5fa2/cmVtb3Zpbmdfc3RhaW5zX2Zyb21fd29vbC5qcGc/600w/a-neatly-stacked-pile-of-folded-sweaters-on-a-marble-surface..jpg",
  Bags: "https://s2.r29static.com/bin/entry/02d/0,0,2000,2400/720x864,85/1552602/image.webp",
};

interface ItemsFormProps {
  listId: string;
}

export default function ItemsForm({ listId }: ItemsFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Food"); // default to Food

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
      }),
    )
      .unwrap() // ensures we can chain after successful dispatch
      .then(() => {
        // reset form after successful add
        setName("");
        setQuantity(1);
        setNotes("");
        setCategory("Food");
      })
      .catch((err) => {
        console.error("Failed to add item:", err);
      });
  };

  return (
    <div className="p-6 border rounded-2xl bg-white shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-700">
        Add New Item
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item name"
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
        />

        <select
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {Object.keys(categoryImages).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {imagePreview && (
          <div className="flex justify-center">
            <img
              src={imagePreview}
              alt={category}
              className="h-24 w-24 object-contain my-2"
            />
          </div>
        )}

        <textarea
          placeholder="Notes (optional)"
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-semibold transition-colors"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
