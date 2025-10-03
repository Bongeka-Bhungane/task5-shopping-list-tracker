// components/UserProfile.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";

// User interface
interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
}

export default function UserProfile() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>("http://localhost:3000/users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const startEdit = (user: User) => {
    setEditingEmail(user.email);
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
    setEditingEmail(null);
    setEditForm({});
    setPasswordFields({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setShowPasswordFields(false);
  };

  const saveEdit = async () => {
    if (!editingEmail) return;

    const currentUser = users.find((u) => u.email === editingEmail);
    if (!currentUser) {
      alert("User not found");
      return;
    }

    // Validate password change if user entered a new password
    if (passwordFields.newPassword || passwordFields.confirmPassword) {
      if (
        !bcrypt.compareSync(passwordFields.oldPassword, currentUser.password)
      ) {
        setPasswordError("Old password is incorrect");
        return;
      }
      if (passwordFields.newPassword !== passwordFields.confirmPassword) {
        setPasswordError("New passwords do not match");
        return;
      }
      // Hash new password
      const salt = bcrypt.genSaltSync(10);
      editForm.password = bcrypt.hashSync(passwordFields.newPassword, salt);
    }

    try {
      const response = await axios.put<User>(
        `http://localhost:3000/users/${currentUser.id}`,
        { ...currentUser, ...editForm } // ✅ keep existing values, merge with edits
      );

      setUsers(users.map((u) => (u.id === currentUser.id ? response.data : u)));
      cancelEdit();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };


  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">User Profiles</h2>
      <div className="row justify-content-center">
        {users.map((user) => (
          <div
            key={user.email}
            className="col-12 col-sm-10 col-md-6 col-lg-4 mb-4 d-flex"
          >
            <div
              className="card shadow-lg rounded-lg p-4 border-0 flex-fill"
              style={{ backgroundColor: "#f9f9f9" }}
            >
              {editingEmail === user.email ? (
                <>
                  <div className="mb-3">
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
                  </div>

                  <hr />
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
                    <div className="mb-3">
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
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => startEdit(user)}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
