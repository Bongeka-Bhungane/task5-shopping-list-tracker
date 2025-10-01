import React, {useState} from "react";
import { Link } from "react-router-dom";

export default function SignupForm() {
    const [formData, setFormData]= useState({
      name: "",
      surname: "",
      email: "",
      phone: "",
      password: "",
      cpassword: ""
    });

    const [errors, setErrors]= useState({})
    const [valid, setValid] = useState(true)

    const handleSubmit = (e) => {
        e.preventDefault();
        let isvalid = true;
        const validationErros={}
        if(formData.name === "" || formData.name === null) {
            isvalid = false;
            validationErros.name = "first name is required"
        }
        if(formData.surname === "" || formData.surname === null) {
            isvalid = false;
            validationErros.surname = "surname is required"
        }
        if(formData.email=== "" || formData.email === null) {
            isvalid = false;
            validationErros.email = "email is required"
        } else if(!/\S+@\S+\.\S/.test(formData.email)) {
            isvalid = false;
            validationErros.email = "please enter a valid email";
        }
        if(formData.password === "" || formData.password === null) {
            isvalid = false;
            validationErros.password = "password is required"
        } else if(formData.password.length < 6) {
            isvalid = false;
            validationErros.password = "password at least be 6 characters long";
        }
        if(formData.cpassword !== formData.password) {
            isvalid = false;
            validationErros.cpassword = "passwords do not match";
        }

        setErrors (validationErros)
        setValid (isvalid)
        if(Object.keys(validationErros).length === 0) {
            alert("succefully registered")
        }
    }

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration custom-card">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">
                    Create an account
                  </h3>
                  {valid ? (
                    <></>
                  ) : (
                    <span>
                      {errors.name}; {errors.surnname}; {errors.email};{" "}
                      {errors.phone}; {errors.password}; {errors.cpassword};{" "}
                    </span>
                  )}
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter your first name"
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              name: event.target.value,
                            })
                          }
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
                          name="surname"
                          placeholder="Please enter surname "
                          className="form-control form-control-lg"
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              surname: event.target.value,
                            })
                          }
                        />
                        <label className="form-label" htmlFor="surname">
                          Surname
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
                          placeholder="Please enter cellphone number "
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="cellNumber">
                          Cell Number
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
                          name="email"
                          placeholder="Please enter email "
                          className="form-control form-control-lg"
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              email: event.target.value,
                            })
                          }
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
                          name="password"
                          placeholder="Please enter password "
                          className="form-control form-control-lg"
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              password: event.target.value,
                            })
                          }
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <input
                          type="password"
                          id="password"
                          name="cpassword"
                          placeholder="Please cornfirm password "
                          className="form-control form-control-lg"
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              cpassword: event.target.value,
                            })
                          }
                        />
                        <label className="form-label" htmlFor="password">
                          Cornfirm password
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
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
