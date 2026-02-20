import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { ShoppingItem } from "../features/items/types";
import type { ShoppingList } from "../features/lists/types";
import { fetchItemsByList } from "../features/items/itemsApi";
import { fetchListByShareToken } from "../features/lists/listsApi";
import "../styles/SharePage.css";

const CATEGORY_OPTIONS = [
  "All",
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

type ShareSort = "date_desc" | "date_asc" | "name_asc" | "name_desc";

function isValidShareSort(v: string): v is ShareSort {
  return ["date_desc", "date_asc", "name_asc", "name_desc"].includes(v);
}

function sortItems(items: ShoppingItem[], sort: ShareSort) {
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

export default function SharePage() {
  const { token } = useParams();
  const [sp, setSp] = useSearchParams();

  const search = sp.get("search") ?? "";
  const sortRaw = sp.get("sort") ?? "date_desc";
  const sort: ShareSort = isValidShareSort(sortRaw) ? sortRaw : "date_desc";
  const cat = sp.get("cat") ?? "All";

  const [list, setList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL setters
  const setSearch = (value: string) => {
    const next = new URLSearchParams(sp);
    if (value.trim()) next.set("search", value);
    else next.delete("search");
    setSp(next, { replace: true });
  };

  const setSort = (value: string) => {
    const next = new URLSearchParams(sp);
    if (isValidShareSort(value)) next.set("sort", value);
    setSp(next, { replace: true });
  };

  const setCat = (value: string) => {
    const next = new URLSearchParams(sp);
    if (value && value !== "All") next.set("cat", value);
    else next.delete("cat");
    setSp(next, { replace: true });
  };

  // Load shared list + its items
  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setError("Missing share token.");
          setLoading(false);
          return;
        }

        const found = await fetchListByShareToken(token);
        if (!alive) return;

        if (!found) {
          setList(null);
          setItems([]);
          setError(
            "This share link is invalid or the list is no longer shared.",
          );
          setLoading(false);
          return;
        }

        setList(found);

        const its = await fetchItemsByList(found.id);
        if (!alive) return;

        setItems(its);
        setLoading(false);
      } catch {
        if (!alive) return;
        setError("Failed to load shared list.");
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [token]);

  // Derived visible items (search + category + sort)
  const visible = useMemo(() => {
    let filtered = items;

    if (search.trim()) {
      filtered = filtered.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (cat !== "All") {
      filtered = filtered.filter((i) => i.category === cat);
    }

    return sortItems(filtered, sort);
  }, [items, search, cat, sort]);

  return (
    <div className="sharePage">
      <header className="shareTop">
        <div className="shareTopInner">
          <div>
            <h1>{list ? list.name : "Shared List"}</h1>
            <p className="muted">
              {list
                ? "View-only shared shopping list"
                : "Open a shared list link"}
            </p>
          </div>

          <div className="badge">Shared</div>
        </div>
      </header>

      <main className="shareMain">
        {loading ? (
          <div className="loader">Loading…</div>
        ) : error ? (
          <div className="errorBox">{error}</div>
        ) : (
          <>
            {/* Controls */}
            <div className="shareControls">
              <div className="field">
                <label>Search</label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search item name…"
                />
              </div>

              <div className="field">
                <label>Category</label>
                <select value={cat} onChange={(e) => setCat(e.target.value)}>
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

            {/* Table */}
            <div className="tableWrap">
              <table className="itemsTable">
                <thead>
                  <tr>
                    <th className="colImg">Image</th>
                    <th>Name</th>
                    <th className="colQty">Qty</th>
                    <th className="colCat">Category</th>
                    <th>Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="emptyRow">
                        No items found.
                      </td>
                    </tr>
                  ) : (
                    visible.map((it) => (
                      <tr key={it.id}>
                        <td className="colImg">
                          {it.imageUrl ? (
                            <img
                              className="thumb"
                              src={it.imageUrl}
                              alt={it.name}
                            />
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
                          {it.notes ? (
                            it.notes
                          ) : (
                            <span className="mutedSmall">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
