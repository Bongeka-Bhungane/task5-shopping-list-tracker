import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  registerThunk,
  selectAuthError,
  selectAuthLoading,
  selectAuthUser,
} from "../features/auth/authSlice";
import "../styles/ProfilePage.css";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const user = useAppSelector(selectAuthUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [form, setForm] = useState({
    name: "",
    surname: "",
    cell: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.surname.trim()) return "Surname is required.";
    if (!form.cell.trim()) return "Cell number is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      alert(msg);
      return;
    }

    const res = await dispatch(
      registerThunk({
        name: form.name.trim(),
        surname: form.surname.trim(),
        cell: form.cell.trim(),
        email: form.email.trim(),
        password: form.password,
      }),
    );

    if (registerThunk.fulfilled.match(res)) {
      nav("/", { replace: true });
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <h1>Create account</h1>
          <p>Register to start building shopping lists</p>
        </div>

        {error ? <div className="authError">{error}</div> : null}

        <form className="authForm" onSubmit={onSubmit}>
          <div className="grid2">
            <div className="field">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Your name"
                autoComplete="given-name"
              />
            </div>

            <div className="field">
              <label>Surname</label>
              <input
                value={form.surname}
                onChange={(e) =>
                  setForm((p) => ({ ...p, surname: e.target.value }))
                }
                placeholder="Your surname"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="grid2">
            <div className="field">
              <label>Cell number</label>
              <input
                value={form.cell}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cell: e.target.value }))
                }
                placeholder="e.g. 0712345678"
                autoComplete="tel"
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="grid2">
            <div className="field">
              <label>Password</label>
              <input
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <div className="field">
              <label>Confirm password</label>
              <input
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="authFooter">
          <span>Already have an account?</span>
          <Link to="/login" className="authLink">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
