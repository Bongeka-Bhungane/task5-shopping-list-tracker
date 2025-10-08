import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";
import { registerUser, clearState } from "../features/signupSlice";
import type { RegisterFormData } from "../features/signupSlice";
import bcrypt from "bcryptjs";

export default function SignupForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useAppSelector((state) => state.register);

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = "First name is required";
    if (!formData.surname) errors.surname = "Surname is required";
    if (!formData.phone) errors.phone = "Phone is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email";
    if (!formData.password) errors.password = "Password required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (formData.cpassword !== formData.password)
      errors.cpassword = "Passwords do not match";
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(formData.password, salt);

      const newUser = {
        ...formData,
        password: hashedPassword,
      };

      dispatch(registerUser(newUser));
    }
  };

  useEffect(() => {
    if (success) {
      alert("Registration successful!");
      dispatch(clearState());
      navigate("/login");
    }
  }, [success, dispatch, navigate]);

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration custom-card">
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4">Create an account</h3>

                {Object.keys(validationErrors).length > 0 && (
                  <div className="alert alert-danger">
                    {Object.values(validationErrors).map((err, idx) => (
                      <div key={idx}>{err}</div>
                    ))}
                  </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="First name"
                        className="form-control form-control-lg"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <label className="form-label">Name</label>
                    </div>
                    <div className="col-md-6 mb-4">
                      <input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        className="form-control form-control-lg"
                        value={formData.surname}
                        onChange={handleChange}
                      />
                      <label className="form-label">Surname</label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Cell number"
                      className="form-control form-control-lg"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <label className="form-label">Cell Number</label>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control form-control-lg"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <label className="form-label">Email Address</label>
                    </div>
                    <div className="col-md-6 mb-4">
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control form-control-lg"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <label className="form-label">Password</label>
                    </div>
                    <div className="col-md-6 mb-4">
                      <input
                        type="password"
                        name="cpassword"
                        placeholder="Confirm password"
                        className="form-control form-control-lg"
                        value={formData.cpassword}
                        onChange={handleChange}
                      />
                      <label className="form-label">Confirm Password</label>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <button
                      className="btn btn-primary btn-lg"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </form>

                <p className="mt-3">
                  Already have an account? <Link to="/login">Login now</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
