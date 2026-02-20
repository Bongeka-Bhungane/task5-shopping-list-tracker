import { http } from "../../services/http";
import type { ShoppingItem } from "./types";

export async function fetchItemsByList(listId: string) {
  const res = await http.get<ShoppingItem[]>(
    `/items`,
  );
  return res.data.filter((item) => item.listId === listId);
}

export async function createItem(item: ShoppingItem) {
  const res = await http.post<ShoppingItem>("/items", item);
  return res.data;
}

export async function patchItem(id: string, patch: Partial<ShoppingItem>) {
  const res = await http.patch<ShoppingItem>(`/items/${id}`, patch);
  return res.data;
}

export async function deleteItemById(id: string) {
  await http.delete(`/items/${id}`);
}

/**
 * Optional helper: delete all items for a list (json-server supports query deletes only via multiple calls)
 */
export async function fetchItemIdsForList(listId: string) {
  const res = await http.get<ShoppingItem[]>(
    `/items?listId=${encodeURIComponent(listId)}`,
  );
  return res.data.map((x) => x.id);
}
