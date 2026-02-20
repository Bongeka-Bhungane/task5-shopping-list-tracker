import type { ShoppingItem } from "../features/items/types";
import "../styles/ItemTable.css";

type Props = {
  items: ShoppingItem[];
  onEdit: (item: ShoppingItem) => void;
  onDelete: (item: ShoppingItem) => void;
};

export default function ItemTable({ items, onEdit, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <div className="itemsEmpty">
        <p>No items found.</p>
        <p className="mutedSmall">Try adding items or change your search.</p>
      </div>
    );
  }

  return (
    <div className="tableWrap">
      <table className="itemsTable">
        <thead>
          <tr>
            <th className="colImg">Image</th>
            <th>Name</th>
            <th className="colQty">Qty</th>
            <th className="colCat">Category</th>
            <th>Notes</th>
            <th className="colActions">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td className="colImg">
                {it.imageUrl ? (
                  <img className="thumb" src={it.imageUrl} alt={it.name} />
                ) : (
                  <div className="thumb placeholder">—</div>
                )}
              </td>

              <td className="nameCell">
                <div className="nameTop">{it.name}</div>
                <div className="nameMeta">
                  Added: {new Date(it.createdAt).toLocaleDateString()}
                </div>
              </td>

              <td className="colQty">{it.quantity}</td>
              <td className="colCat">
                <span className="tag">{it.category}</span>
              </td>

              <td className="notesCell">
                {it.notes ? it.notes : <span className="mutedSmall">—</span>}
              </td>

              <td className="colActions">
                <div className="rowActions">
                  <button className="actionBtn" onClick={() => onEdit(it)}>
                    Edit
                  </button>
                  <button
                    className="actionBtn danger"
                    onClick={() => onDelete(it)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
