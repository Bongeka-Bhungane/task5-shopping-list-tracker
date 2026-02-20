import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  loginThunk,
  selectAuthError,
  selectAuthLoading,
  selectAuthUser,
} from "../features/auth/authSlice";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const user = useAppSelector(selectAuthUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      alert("Email and password are required.");
      return;
    }

    const res = await dispatch(
      loginThunk({ email: form.email.trim(), password: form.password }),
    );

    if (loginThunk.fulfilled.match(res)) {
      nav("/", { replace: true });
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <h1>Welcome back</h1>
          <p>Login to manage your shopping lists</p>
        </div>

        {error ? <div className="authError">{error}</div> : null}

        <form className="authForm" onSubmit={onSubmit}>
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

          <div className="field">
            <label>Password</label>
            <input
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="authFooter">
          <span>Don’t have an account?</span>
          <Link to="/register" className="authLink">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
