import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};

    //  Basic validations
    if (!formData.email) {
      isValid = false;
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      validationErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      isValid = false;
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      isValid = false;
      validationErrors.password = "Password must be at least 6 characters";
    }

    axios
      .get("http://localhost:3000/users")
      .then((result) => {
        result.data.map((user) => {
          if (user.email === formData.email) {
            if (user.password === formData.password) {
              alert("you are logged in");
              navigate('/main')
            } else {
              isValid = false;
              validationErrors.password = "Wrong password; ";
            }
          }
        });
        setErrors(validationErrors);
        setValid(isValid);
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

                  {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger">
                      {Object.values(errors).map((err, idx) => (
                        <div key={idx}>{err}</div>
                      ))}
                    </div>
                  )}

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
