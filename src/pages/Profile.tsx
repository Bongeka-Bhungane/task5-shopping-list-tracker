import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";

export default function Profile() {
  const navigate = useNavigate();

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser?.id;

  return (
    <div className="container my-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/main")}
      >
        &larr; Back
      </button>

      {userId ? (
        <UserProfile userId={userId} />
      ) : (
        <p>Please log in to see your profile.</p>
      )}
    </div>
  );
}
