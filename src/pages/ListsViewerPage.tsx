import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  fetchUserLists,
} from "../features/shoppingListSlice";
import ListCard from "../components/ListCard";
import ListsForm from "../components/ListsForm";

export default function ListViewerPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { lists, loading } = useSelector(
    (state: RootState) => state.shoppingList
  );
  console.log("list...: ", lists);

  const [showModal, setShowModal] = useState(false);

  // ✅ Get logged-in user
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser?.id;

  // ✅ Fetch this user's lists
  useEffect(() => {
    if (userId) dispatch(fetchUserLists(userId));
  }, [dispatch, userId]);


  if (loading) return <p className="text-center mt-5">Loading lists...</p>;

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Shopping Lists</h2>
        <button
          className="btn btn-success btn-lg"
          onClick={() => setShowModal(true)}
        >
          + Add New List
        </button>
      </div>

      {/* LISTS */}
      {lists.length === 0 ? (
        <div className="text-center mt-5">
          <h3>No shopping lists yet</h3>
          <p className="text-muted">Start by adding your first list!</p>
        </div>
      ) : (
        <div className="row">
          {lists.map((list) => (
            <div key={list.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <ListCard list={list} />
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <ListsForm
          userId={userId}
          onClose={() => setShowModal(false)} // optional: pass onSave if your form supports it
        />
      )}
    </div>
  );
}
