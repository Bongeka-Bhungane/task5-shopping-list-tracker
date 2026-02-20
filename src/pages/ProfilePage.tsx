import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectAuthUser,
  updateCredentialsThunk,
  updateProfileThunk,
} from "../features/auth/authSlice";
import Navbar from "../components/Navbar";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    cell: user?.cell || "",
  });

  const [credentials, setCredentials] = useState({
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  if (!user) return null;

  // ---------- PROFILE ----------
  const updateProfile = async () => {
    if (!profile.name.trim()) return alert("Name required");
    if (!profile.surname.trim()) return alert("Surname required");

    await dispatch(
      updateProfileThunk({
        id: user.id,
        name: profile.name,
        surname: profile.surname,
        cell: profile.cell,
      }),
    );

    alert("Profile updated");
  };

  // ---------- CREDENTIALS ----------
  const updateCredentials = async () => {
    if (!credentials.email.trim()) return alert("Email required");

    if (credentials.password) {
      if (credentials.password.length < 6)
        return alert("Password must be at least 6 characters");

      if (credentials.password !== credentials.confirmPassword)
        return alert("Passwords do not match");
    }

    await dispatch(
      updateCredentialsThunk({
        id: user.id,
        email: credentials.email,
        newPassword: credentials.password || undefined,
      }),
    );

    alert("Credentials updated");
  };

  return (
    <div className="profilePage">
      <Navbar />

      <div className="profileContainer">
        <h1>My Profile</h1>

        {/* PROFILE INFO */}
        <div className="card">
          <h2>Personal Information</h2>

          <div className="grid2">
            <div className="field">
              <label>Name</label>
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div className="field">
              <label>Surname</label>
              <input
                value={profile.surname}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, surname: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="field">
            <label>Cell Number</label>
            <input
              value={profile.cell}
              onChange={(e) =>
                setProfile((p) => ({ ...p, cell: e.target.value }))
              }
            />
          </div>

          <button className="btnPrimary" onClick={updateProfile}>
            Save Profile
          </button>
        </div>

        {/* CREDENTIALS */}
        <div className="card">
          <h2>Login Credentials</h2>

          <div className="field">
            <label>Email</label>
            <input
              value={credentials.email}
              onChange={(e) =>
                setCredentials((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>

          <div className="grid2">
            <div className="field">
              <label>New Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((p) => ({ ...p, password: e.target.value }))
                }
              />
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={credentials.confirmPassword}
                onChange={(e) =>
                  setCredentials((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <button className="btnPrimary" onClick={updateCredentials}>
            Update Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
