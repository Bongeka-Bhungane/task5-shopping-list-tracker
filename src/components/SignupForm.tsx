import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
    lists: [],
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const validationErrors = {};

    // ✅ Basic validations
    if (!formData.name) {
      isValid = false;
      validationErrors.name = "First name is required";
    }
    if (!formData.surname) {
      isValid = false;
      validationErrors.surname = "Surname is required";
    }
    if (!formData.phone) {
      isValid = false;
      validationErrors.phone = "Phone number is required";
    }
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
    if (formData.cpassword !== formData.password) {
      isValid = false;
      validationErrors.cpassword = "Passwords do not match";
    }

    setErrors(validationErrors);

    if (!isValid) return;

   try {
     // Check for duplicate email
     const emailCheck = await axios.get(
       `http://localhost:3000/users?email=${formData.email}`
     );

     if (emailCheck.data.length > 0) {
       alert("Email is already registered!");
       return;
     }

     // Check for duplicate phone
     const phoneCheck = await axios.get(
       `http://localhost:3000/users?phone=${formData.phone}`
     );

     if (phoneCheck.data.length > 0) {
       alert("Phone number is already registered!");
       return;
     }

     // ✅ Save user
     await axios.post("http://localhost:3000/users", formData);
     alert("Successfully registered 🎉");
     navigate("/login");
   } catch (err) {
     console.error(err);
     alert("Something went wrong, please try again.");
   }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration custom-card">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <h3 className="mb-4">Create an account</h3>

                  {/* Show errors */}
                  {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger">
                      {Object.values(errors).map((err, idx) => (
                        <div key={idx}>{err}</div>
                      ))}
                    </div>
                  )}

                  {/* Name + Surname */}
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your first name"
                        className="form-control form-control-lg"
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      <label className="form-label">Name</label>
                    </div>
                    <div className="col-md-6 mb-4">
                      <input
                        type="text"
                        name="surname"
                        placeholder="Enter your surname"
                        className="form-control form-control-lg"
                        onChange={(e) =>
                          setFormData({ ...formData, surname: e.target.value })
                        }
                      />
                      <label className="form-label">Surname</label>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter cellphone number"
                      className="form-control form-control-lg"
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                    <label className="form-label">Cell Number</label>
                  </div>

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
                    <div className="col-md-6 mb-4">
                      <input
                        type="password"
                        name="cpassword"
                        placeholder="Confirm password"
                        className="form-control form-control-lg"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cpassword: e.target.value,
                          })
                        }
                      />
                      <label className="form-label">Confirm Password</label>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-4 pt-2">
                    <button className="btn btn-primary btn-lg">Register</button>
                  </div>
                </form>

                <p className="mt-3">
                  Already have an account?{" "}
                  <Link to="/login" className="login-link">
                    Login now!!
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
