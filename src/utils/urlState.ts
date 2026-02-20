export type SortKey =
  | "name_asc"
  | "name_desc"
  | "category_asc"
  | "category_desc"
  | "date_asc"
  | "date_desc";

export function isValidSort(v: string): v is SortKey {
  return [
    "name_asc",
    "name_desc",
    "category_asc",
    "category_desc",
    "date_asc",
    "date_desc",
  ].includes(v);
}

export function getUrlState(sp: URLSearchParams) {
  const search = sp.get("search") ?? "";
  const sortRaw = sp.get("sort") ?? "date_desc";
  const sort = isValidSort(sortRaw) ? sortRaw : ("date_desc" as SortKey);
  return { search, sort };
}
