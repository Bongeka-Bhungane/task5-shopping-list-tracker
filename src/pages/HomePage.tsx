// HomePage.tsx (UPDATED with only the requested changes + full screen + input borders)
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../features/auth/authSlice";

import {
  addListThunk,
  deleteListThunk,
  fetchListsThunk,
  selectList,
  selectLists,
  selectListsLoading,
  selectSelectedList,
  selectSelectedListId,
  shareListThunk,
  updateListThunk,
} from "../features/lists/listsSlice";

import {
  addItemThunk,
  deleteItemThunk,
  fetchItemsThunk,
  selectItems,
  selectItemsLoading,
  updateItemThunk,
} from "../features/items/itemsSlice";

import type { ShoppingList } from "../features/lists/types";
import type { ShoppingItem } from "../features/items/types";

import Navbar from "../components/Navbar";
import ListCard from "../components/ListCard";
import ItemTable from "../components/ItemTable";
import Modal from "../components/Modal";

import { getUrlState, isValidSort, type SortKey } from "../utils/urlState";

import "../styles/HomePage.css";

/** ✅ Required categories */
const CATEGORY_OPTIONS = [
  "Groceries",
  "Drinks",
  "Fruits",
  "Veggies",
  "Snacks",
  "Stationary",
  "Appliances",
  "Cosmetic",
  "Home Deco",
  "Clothes",
  "Shoes",
  "Hair care",
] as const;

function sortItems(items: ShoppingItem[], sort: SortKey) {
  const copy = [...items];
  switch (sort) {
    case "name_asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "date_asc":
      return copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "date_desc":
    default:
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

function sortLists(
  lists: ShoppingList[],
  sort: "date_desc" | "date_asc" | "name_asc" | "name_desc",
) {
  const copy = [...lists];
  switch (sort) {
    case "name_asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "date_asc":
      return copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "date_desc":
    default:
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  const lists = useAppSelector(selectLists);
  const listsLoading = useAppSelector(selectListsLoading);
  const selectedListId = useAppSelector(selectSelectedListId);
  const selectedList = useAppSelector(selectSelectedList);

  const items = useAppSelector(selectItems);
  const itemsLoading = useAppSelector(selectItemsLoading);

  const [sp, setSp] = useSearchParams();
  const { search, sort } = getUrlState(sp);

  /** ✅ Item category filter from URL */
  const itemCategory = sp.get("cat") ?? "All";

  /** ✅ List side search + sort (from URL) */
  const listSearch = sp.get("lsearch") ?? "";
  const listSortRaw = sp.get("lsort") ?? "date_desc";
  const listSort = (
    ["date_desc", "date_asc", "name_asc", "name_desc"].includes(listSortRaw)
      ? listSortRaw
      : "date_desc"
  ) as "date_desc" | "date_asc" | "name_asc" | "name_desc";

  // Modals state
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listModalMode, setListModalMode] = useState<"add" | "edit">("add");
  const [listName, setListName] = useState("");

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalMode, setItemModalMode] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  const [itemForm, setItemForm] = useState({
    name: "",
    quantity: 1,
    category: "Groceries",
    notes: "",
    imageUrl: "",
  });

  // Load lists on entry
  useEffect(() => {
    if (!user?.id) return;
    dispatch(fetchListsThunk(user.id));
  }, [dispatch, user?.id]);

  // Fetch items when selected list changes
  useEffect(() => {
    if (!selectedListId) return;
    dispatch(fetchItemsThunk({ listId: selectedListId }));
  }, [dispatch, selectedListId]);

  // URL handlers (items search)
  const setSearch = (value: string) => {
    const next = new URLSearchParams(sp);
    if (value.trim()) next.set("search", value);
    else next.delete("search");
    setSp(next, { replace: true });
  };

  // ✅ Split sorting: only date/name
  const setSort = (value: string) => {
    const next = new URLSearchParams(sp);
    if (isValidSort(value)) next.set("sort", value);
    setSp(next, { replace: true });
  };

  // ✅ Item category filter on URL
  const setItemCategory = (value: string) => {
    const next = new URLSearchParams(sp);
    if (value && value !== "All") next.set("cat", value);
    else next.delete("cat");
    setSp(next, { replace: true });
  };

  // ✅ List search on URL
  const setListSearch = (value: string) => {
    const next = new URLSearchParams(sp);
    if (value.trim()) next.set("lsearch", value);
    else next.delete("lsearch");
    setSp(next, { replace: true });
  };

  // ✅ List sort on URL (date/name)
  const setListSort = (value: string) => {
    const next = new URLSearchParams(sp);
    if (["date_desc", "date_asc", "name_asc", "name_desc"].includes(value))
      next.set("lsort", value);
    setSp(next, { replace: true });
  };

  // Derived visible items (✅ now also filters by category)
  const visibleItems = useMemo(() => {
    let filtered = items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (itemCategory !== "All") {
      filtered = filtered.filter((i) => i.category === itemCategory);
    }

    return sortItems(filtered, sort);
  }, [items, search, sort, itemCategory]);

  // ✅ Derived visible lists (search + sort)
  const visibleLists = useMemo(() => {
    const filtered = lists.filter((l) =>
      l.name.toLowerCase().includes(listSearch.toLowerCase()),
    );
    return sortLists(filtered, listSort);
  }, [lists, listSearch, listSort]);

  // ---------- LIST ACTIONS ----------
  const openAddList = () => {
    setListModalMode("add");
    setListName("");
    setIsListModalOpen(true);
  };

  const openEditList = (list: ShoppingList) => {
    setListModalMode("edit");
    setListName(list.name);
    setIsListModalOpen(true);
  };

  const submitList = async () => {
    if (!user?.id) return;
    if (!listName.trim()) {
      alert("List name is required.");
      return;
    }

    if (listModalMode === "add") {
      await dispatch(addListThunk({ userId: user.id, name: listName }));
    } else if (listModalMode === "edit" && selectedListId) {
      await dispatch(updateListThunk({ id: selectedListId, name: listName }));
    }

    setIsListModalOpen(false);
  };

  const onSelectList = (id: string) => {
    dispatch(selectList(id));
  };

  const onDeleteList = async (list: ShoppingList) => {
    const ok = window.confirm(
      `Delete list "${list.name}"? This will remove its items too.`,
    );
    if (!ok) return;
    await dispatch(deleteListThunk({ id: list.id, alsoDeleteItems: true }));
  };

  const onShareList = async (list: ShoppingList) => {
    await dispatch(shareListThunk({ id: list.id }));
  };

  // ---------- ITEM ACTIONS ----------
  const openAddItem = () => {
    if (!selectedListId) {
      alert("Create/select a list first.");
      return;
    }
    setItemModalMode("add");
    setEditingItem(null);
    setItemForm({
      name: "",
      quantity: 1,
      category: "Groceries",
      notes: "",
      imageUrl: "",
    });
    setIsItemModalOpen(true);
  };

  const openEditItem = (item: ShoppingItem) => {
    setItemModalMode("edit");
    setEditingItem(item);
    setItemForm({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      notes: item.notes || "",
      imageUrl: item.imageUrl || "",
    });
    setIsItemModalOpen(true);
  };

  const submitItem = async () => {
    if (!user?.id || !selectedListId) return;

    if (!itemForm.name.trim()) {
      alert("Item name is required.");
      return;
    }
    if (!itemForm.category.trim()) {
      alert("Category is required.");
      return;
    }
    if (!Number(itemForm.quantity) || Number(itemForm.quantity) < 1) {
      alert("Quantity must be 1 or more.");
      return;
    }

    if (itemModalMode === "add") {
      await dispatch(
        addItemThunk({
          userId: user.id,
          listId: selectedListId,
          name: itemForm.name,
          quantity: Number(itemForm.quantity),
          category: itemForm.category,
          notes: itemForm.notes,
          imageUrl: itemForm.imageUrl,
        }),
      );
    } else if (itemModalMode === "edit" && editingItem) {
      await dispatch(
        updateItemThunk({
          id: editingItem.id,
          patch: {
            name: itemForm.name,
            quantity: Number(itemForm.quantity),
            category: itemForm.category,
            notes: itemForm.notes,
            imageUrl: itemForm.imageUrl,
          },
        }),
      );
    }

    setIsItemModalOpen(false);
  };

  const onDeleteItem = async (item: ShoppingItem) => {
    const ok = window.confirm(`Delete item "${item.name}"?`);
    if (!ok) return;
    await dispatch(deleteItemThunk({ id: item.id }));
  };

  // Copy share link
  const shareUrl =
    selectedList?.shareToken && selectedList?.shareToken.trim()
      ? `${window.location.origin}/share/${selectedList.shareToken}?sort=date_desc`
      : "";

  const copyShareLink = async () => {
    if (!selectedList) return;

    // If no token yet, generate it first, then copy
    if (!selectedList.shareToken) {
      const res = await dispatch(shareListThunk({ id: selectedList.id }));

      if (shareListThunk.fulfilled.match(res)) {
        const token = res.payload.shareToken;
        const url = `${window.location.origin}/share/${token}?sort=date_desc`;
        await navigator.clipboard.writeText(url);
        alert("Share link generated & copied!");
        return;
      }

      alert("Could not generate share link. Try again.");
      return;
    }

    // Token already exists → copy
    await navigator.clipboard.writeText(shareUrl);
    alert("Share link copied!");
  };

  return (
    <div className="homePage">
      <Navbar />

      <div className="homeLayout">
        {/* LEFT: LISTS */}
        <aside className="listsPanel">
          <div className="panelHeader">
            <div>
              <h2>My Lists</h2>
              <p className="muted">Create and manage your shopping lists</p>
            </div>
            <button className="btn primary" onClick={openAddList}>
              + Add List
            </button>
          </div>

          {/* ✅ List search + sort (date/name) */}
          <div className="listsFilters">
            <div className="field">
              <label>Search Lists</label>
              <input
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                placeholder="Search list name…"
              />
            </div>

            <div className="field">
              <label>Sort Lists</label>
              <select
                value={listSort}
                onChange={(e) => setListSort(e.target.value)}
              >
                <option value="date_desc">Date added (new → old)</option>
                <option value="date_asc">Date added (old → new)</option>
                <option value="name_asc">Name (A → Z)</option>
                <option value="name_desc">Name (Z → A)</option>
              </select>
            </div>
          </div>

          {listsLoading ? (
            <div className="panelBody">
              <div className="loader">Loading lists…</div>
            </div>
          ) : lists.length === 0 ? (
            <div className="panelBody empty">
              <p>No lists yet.</p>
              <button className="btn primary" onClick={openAddList}>
                Create your first list
              </button>
            </div>
          ) : (
            <div className="panelBody listStack">
              {visibleLists.map((l) => (
                <ListCard
                  key={l.id}
                  list={l}
                  isSelected={l.id === selectedListId}
                  onSelect={() => onSelectList(l.id)}
                  onEdit={() => openEditList(l)}
                  onDelete={() => onDeleteList(l)}
                  onShare={() => onShareList(l)}
                />
              ))}
            </div>
          )}
        </aside>

        {/* RIGHT: ITEMS */}
        <main className="itemsPanel">
          <div className="panelHeader">
            <div>
              <h2>{selectedList ? selectedList.name : "Items"}</h2>
              <p className="muted">
                {selectedList
                  ? "Manage items in the selected list"
                  : "Select a list to view items"}
              </p>
            </div>

            <div className="headerActions">
              <button
                className="btn"
                onClick={openAddItem}
                disabled={!selectedListId}
              >
                + Add Item
              </button>
            </div>
          </div>

          {/* Share bar */}
          {selectedList && (
            <div className="shareBar">
              <div className="shareLeft">
                <span className="shareLabel">Share:</span>

                {selectedList.shareToken ? (
                  <a
                    className="shareLink"
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Open shared list"
                  >
                    {shareUrl}
                  </a>
                ) : (
                  <span className="muted">
                    Click “Generate link” to create a share URL.
                  </span>
                )}
              </div>

              <div className="shareRight">
                {/* ✅ Generate link if none yet */}
                <button
                  className="btn"
                  onClick={async () => {
                    const res = await dispatch(
                      shareListThunk({ id: selectedList.id }),
                    );
                    if (shareListThunk.fulfilled.match(res)) {
                      alert("Share link generated!");
                    } else {
                      alert("Could not generate share link. Try again.");
                    }
                  }}
                  disabled={!!selectedList.shareToken}
                  title={
                    selectedList.shareToken
                      ? "Link already generated"
                      : "Generate share link"
                  }
                >
                  {selectedList.shareToken ? "Link ready" : "Generate link"}
                </button>

                {/* ✅ Copy always works (and will generate first if missing) */}
                <button className="btn" onClick={copyShareLink}>
                  Copy link
                </button>
              </div>
            </div>
          )}

          {/* ✅ Split filters: Search + Category + Sort(name/date) */}
          <div className="filtersRow filtersRow3">
            <div className="field">
              <label>Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by item name…"
              />
            </div>

            <div className="field">
              <label>Category</label>
              <select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
              >
                <option value="All">All</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Sort</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="date_desc">Date added (new → old)</option>
                <option value="date_asc">Date added (old → new)</option>
                <option value="name_asc">Name (A → Z)</option>
                <option value="name_desc">Name (Z → A)</option>
              </select>
            </div>
          </div>

          {/* Items table */}
          <div className="panelBody">
            {!selectedListId ? (
              <div className="empty">
                <p>Select a list on the left to view items.</p>
              </div>
            ) : itemsLoading ? (
              <div className="loader">Loading items…</div>
            ) : (
              <ItemTable
                items={visibleItems}
                onEdit={openEditItem}
                onDelete={onDeleteItem}
              />
            )}
          </div>
        </main>
      </div>

      {/* LIST MODAL */}
      <Modal
        open={isListModalOpen}
        title={listModalMode === "add" ? "Add List" : "Edit List"}
        onClose={() => setIsListModalOpen(false)}
        onConfirm={submitList}
        confirmText={listModalMode === "add" ? "Create" : "Save"}
      >
        <div className="modalForm">
          <div className="field">
            <label>List name</label>
            <input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="e.g. Monthly groceries"
            />
          </div>
        </div>
      </Modal>

      {/* ITEM MODAL */}
      <Modal
        open={isItemModalOpen}
        title={itemModalMode === "add" ? "Add Item" : "Edit Item"}
        onClose={() => setIsItemModalOpen(false)}
        onConfirm={submitItem}
        confirmText={itemModalMode === "add" ? "Add" : "Save"}
      >
        <div className="modalForm">
          <div className="grid2">
            <div className="field">
              <label>Name</label>
              <input
                value={itemForm.name}
                onChange={(e) =>
                  setItemForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Milk"
              />
            </div>

            <div className="field">
              <label>Quantity</label>
              <input
                type="number"
                min={1}
                value={itemForm.quantity}
                onChange={(e) =>
                  setItemForm((p) => ({
                    ...p,
                    quantity: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid2">
            {/* ✅ Category select with required options */}
            <div className="field">
              <label>Category</label>
              <select
                value={itemForm.category}
                onChange={(e) =>
                  setItemForm((p) => ({ ...p, category: e.target.value }))
                }
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Image URL (optional)</label>
              <input
                value={itemForm.imageUrl}
                onChange={(e) =>
                  setItemForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="field">
            <label>Notes (optional)</label>
            <textarea
              value={itemForm.notes}
              onChange={(e) =>
                setItemForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Any extra notes…"
              rows={4}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
