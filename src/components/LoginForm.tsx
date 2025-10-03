import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading } = useSelector((state: RootState) => state.LoginSlice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔎 Fetch users and check login
    axios
      .get("http://localhost:3000/users")
      .then((res) => {
        const user = res.data.find((u: any) => u.email === formData.email);

        if (!user) {
          setErrors({ email: "Email not found" });
          return;
        }

        const passwordMatch = bcrypt.compareSync(
          formData.password,
          user.password
        );

        if (!passwordMatch) {
          setErrors({ password: "Invalid password" });
          return;
        }

        alert("Login successful!");
        navigate("/main");
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration custom-card">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <h3 className="mb-4">Login</h3>

                  {/* Show errors */}
                  {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger">
                      {Object.values(errors).map((err, idx) => (
                        <div key={idx}>{err}</div>
                      ))}
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <input
                        type="email"
                        placeholder="Enter email"
                        className="form-control form-control-lg"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      <label className="form-label">Email Address</label>
                    </div>
                    <div className="col-md-6 mb-4">
                      <input
                        type="password"
                        placeholder="Enter password"
                        className="form-control form-control-lg"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      <label className="form-label">Password</label>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <button
                      className="btn btn-primary btn-lg"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </form>

                <p className="mt-3">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="login-link">
                    Register now!!
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
