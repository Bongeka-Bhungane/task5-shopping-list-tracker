import type { ShoppingList } from "../features/lists/types";
import "../styles/ListCard.css";

type Props = {
  list: ShoppingList;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
};

export default function ListCard({
  list,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onShare,
}: Props) {
  return (
    <div className={`listCard ${isSelected ? "selected" : ""}`}>
      <button className="listMain" onClick={onSelect} title="Select list">
        <div className="listTitleRow">
          <span className="listTitle">{list.name}</span>
          {list.shareToken ? <span className="pill">Shared</span> : null}
        </div>
        <div className="listMeta">
          Updated: {new Date(list.updatedAt).toLocaleDateString()}
        </div>
      </button>

      <div className="listActions">
        <button
          className="iconBtn"
          onClick={onShare}
          title="Generate share link"
        >
          Share
        </button>
        <button className="iconBtn" onClick={onEdit} title="Edit list">
          Edit
        </button>
        <button
          className="iconBtn danger"
          onClick={onDelete}
          title="Delete list"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
