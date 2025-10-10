import React from "react";
import type { Item } from "../features/itemSlice"; // adjust path

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="card shadow-sm mb-3" style={{ maxWidth: "350px" }}>
      {/* Image preview */}
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="card-img-top"
          style={{ maxHeight: "150px", objectFit: "cover" }}
        />
      )}

      <div className="card-body">
        <h5 className="card-title">{item.name}</h5>

        <p className="card-text">
          <strong>Quantity:</strong> {item.quantity}
        </p>

        {item.notes && (
          <p className="card-text">
            <strong>Notes:</strong> {item.notes}
          </p>
        )}

        <p className="card-text">
          <strong>Category:</strong> {item.category}
        </p>
      </div>
    </div>
  );
}
