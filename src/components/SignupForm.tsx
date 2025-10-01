import React, {useState} from "react";
import { Link } from "react-router-dom";

export default function SignupForm() {
    const formData = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      cpassword: ""
    });


  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration custom-card">
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Create an account</h3>

                <form>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <input
                          type="text"
                          id="name"
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="name">
                          Name
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <input
                          type="text"
                          id="surname"
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="surname">
                          Surname
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Email & Password */}
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <input
                          type="email"
                          id="email"
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="email">
                          Email Address
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Cell Number */}
                  <div className="row">
                    <div className="col-md-12 mb-4">
                      <div className="form-outline">
                        <input
                          type="tel"
                          id="cellNumber"
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="cellNumber">
                          Cell Number
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4 pt-2">
                    <button className="btn btn-primary btn-lg" type="submit">
                      Register
                    </button>
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
