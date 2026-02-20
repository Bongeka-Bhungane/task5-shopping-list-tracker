export type ItemCategory =
  | "Groceries"
  | "Toiletries"
  | "Household"
  | "Clothing"
  | "Electronics"
  | "Other"
  | string;

export type ShoppingItem = {
  id: string;
  listId: string;
  userId: string;

  name: string;
  quantity: number;
  notes?: string;
  category: ItemCategory;
  imageUrl?: string;

  createdAt: string;
  updatedAt: string;
};
