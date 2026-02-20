import { http } from "../../services/http";
import type { ShoppingList } from "./types";

export async function fetchListsByUser(userId: string) {
  const lists = await http.get<ShoppingList[]>(`/lists`);

  return lists.data.filter((list) => list.userId === userId);
}

export async function createList(list: ShoppingList) {
  const res = await http.post<ShoppingList>("/lists", list);
  return res.data;
}

export async function patchList(id: string, patch: Partial<ShoppingList>) {
  const res = await http.patch<ShoppingList>(`/lists/${id}`, patch);
  return res.data;
}

export async function deleteListById(id: string) {
  await http.delete(`/lists/${id}`);
}

// ✅ Fetch list by share token (public)
export async function fetchListByShareToken(token: string) {
  const res = await http.get<ShoppingList[]>(
    `/lists?shareToken=${encodeURIComponent(token)}`,
  );
  return res.data[0] ?? null; // json-server returns an array
}