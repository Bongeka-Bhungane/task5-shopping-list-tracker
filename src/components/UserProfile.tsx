import React, { useEffect, useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";

// User interface
interface User {
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

  // Fetch users
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

    // Find current user
    const currentUser = users.find((u) => u.email === editingEmail);
    if (!currentUser) return;

    // Validate password change if shown
    if (
      showPasswordFields &&
      (passwordFields.newPassword || passwordFields.confirmPassword)
    ) {
      const oldPasswordMatches = bcrypt.compareSync(
        passwordFields.oldPassword,
        currentUser.password
      );

      if (!oldPasswordMatches) {
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
        `http://localhost:3000/users/${editingEmail}`,
        editForm
      );
      setUsers(
        users.map((u) => (u.email === editingEmail ? response.data : u))
      );
      cancelEdit();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">User Profiles</h2>
      <div className="row">
        {users.map((user) => (
          <div key={user.email} className="col-md-6 mb-4">
            <div className="card shadow-sm p-3 h-100">
              {editingEmail === user.email ? (
                <>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editForm.surname || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, surname: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    className="form-control mb-2"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                  <input
                    type="tel"
                    className="form-control mb-2"
                    value={editForm.phone || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                  />

                  <hr />
                  <button
                    className="btn btn-outline-primary mb-2"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    type="button"
                  >
                    {showPasswordFields
                      ? "Hide Password Fields"
                      : "Change Password"}
                  </button>

                  {showPasswordFields && (
                    <>
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
                    </>
                  )}

                  <div className="d-flex justify-content-between mt-2">
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
                  <h5>
                    {user.name} {user.surname}
                  </h5>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                  <button
                    className="btn btn-primary"
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
