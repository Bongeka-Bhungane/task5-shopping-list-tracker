import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";
import {
  fetchUserProfile,
  updateUserProfile,
  type User,
} from "../features/profileSlice";

interface UserProfileProps {
  userId: number; // Pass the user ID as a prop
}

export default function UserProfile({ userId }: UserProfileProps) {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Fetch any user by ID dynamically
  useEffect(() => {
    dispatch(fetchUserProfile(userId));
  }, [dispatch, userId]);

  if (loading) return <p>Loading user...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!user) return <p>No user profile found</p>;

  const startEdit = () => {
    setEditing(true);
    setEditForm({ ...user });
    setPasswordFields({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setShowPasswordFields(false);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditForm({});
    setPasswordFields({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setShowPasswordFields(false);
  };

  const saveEdit = () => {
    if (!user) return;

    // Password update validation
    if (passwordFields.newPassword || passwordFields.confirmPassword) {
      if (
        !bcrypt.compareSync(passwordFields.oldPassword, user.password || "")
      ) {
        setPasswordError("Old password is incorrect");
        return;
      }
      if (passwordFields.newPassword !== passwordFields.confirmPassword) {
        setPasswordError("New passwords do not match");
        return;
      }
      const salt = bcrypt.genSaltSync(10);
      editForm.password = bcrypt.hashSync(passwordFields.newPassword, salt);
    }

    dispatch(updateUserProfile({ ...user, ...editForm } as User))
      .unwrap()
      .then(() => {
        alert("Profile updated successfully!");
        cancelEdit();
      })
      .catch(() => {
        alert("Failed to update profile");
      });
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">User Profile</h2>
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4 d-flex">
          <div
            className="card shadow-lg rounded-lg p-4 border-0 flex-fill"
            style={{ backgroundColor: "#f9f9f9" }}
          >
            {editing ? (
              <>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="First Name"
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Surname"
                  value={editForm.surname || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, surname: e.target.value })
                  }
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={editForm.email || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
                <input
                  type="tel"
                  className="form-control mb-2"
                  placeholder="Phone"
                  value={editForm.phone || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                />

                <button
                  className="btn btn-outline-primary mb-3"
                  type="button"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                >
                  {showPasswordFields
                    ? "Hide Password Fields"
                    : "Change Password"}
                </button>

                {showPasswordFields && (
                  <div>
                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="Old Password"
                      value={passwordFields.oldPassword}
                      onChange={(e) =>
                        setPasswordFields({
                          ...passwordFields,
                          oldPassword: e.target.value,
                        })
                      }
                    />
                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="New Password"
                      value={passwordFields.newPassword}
                      onChange={(e) =>
                        setPasswordFields({
                          ...passwordFields,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="Confirm New Password"
                      value={passwordFields.confirmPassword}
                      onChange={(e) =>
                        setPasswordFields({
                          ...passwordFields,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    {passwordError && (
                      <p className="text-danger">{passwordError}</p>
                    )}
                  </div>
                )}

                <div className="d-flex justify-content-between mt-3">
                  <button className="btn btn-success" onClick={saveEdit}>
                    Save
                  </button>
                  <button className="btn btn-danger" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h5 className="mb-2 text-center">
                  {user.name} {user.surname}
                </h5>
                <p className="mb-1 text-center">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="mb-3 text-center">
                  <strong>Phone:</strong> {user.phone}
                </p>
                <button className="btn btn-primary w-100" onClick={startEdit}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
