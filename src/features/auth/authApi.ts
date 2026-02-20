import { http } from "../../services/http";
import type { User } from "./types";

export async function findUserByEmail(email: string) {
  const res = await http.get<User[]>(
    `/users?email=${encodeURIComponent(email)}`,
  );
  return res.data[0];
}

export async function createUser(user: User) {
  const res = await http.post<User>("/users", user);
  return res.data;
}

export async function updateUser(id: string, patch: Partial<User>) {
  const res = await http.patch<User>(`/users/${id}`, patch);
  return res.data;
}
