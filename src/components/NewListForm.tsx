import React from 'react'

export default function NewListForm() {
  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration custom-card">
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4">Add new item</h3>
                <form>
                  <div className="row">
                    <div className="mb-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="First name"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label">Name</label>
                    </div>
                    <div className="mb-4">
                      <input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        className="form-control form-control-lg"
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
                    />
                    <label className="form-label">Cell Number</label>
                  </div>

                  <div className="row">
                    <div className="mb-4">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label">Email Address</label>
                    </div>
                    <div className="mb-4">
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label">Password</label>
                    </div>
                    <div className="mb-4">
                      <input
                        type="password"
                        name="cpassword"
                        placeholder="Confirm password"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label">Confirm Password</label>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <button
                      className="btn btn-primary btn-lg"
                      type="submit"
                    >save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
