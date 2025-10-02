import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration custom-card">
              <div className="card-body p-4 p-md-5">
                <form>
                  <h3 className="mb-4">Create an account</h3>

                  {/* Email + Password */}
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        className="form-control form-control-lg"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      <label className="form-label">Email Address</label>
                    </div>
                    <div className="col-md-6 mb-4">
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        className="form-control form-control-lg"
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      <label className="form-label">Password</label>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-4 pt-2">
                    <button className="btn btn-primary btn-lg">Login</button>
                  </div>
                </form>

                <p className="mt-3">
                  Don't have an account?{" "}
                  <Link to="/login" className="login-link">
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
