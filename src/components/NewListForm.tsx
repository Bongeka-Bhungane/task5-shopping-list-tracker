import React, { useState } from "react";

export default function NewListForm() {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    notes: "",
    category: "",
    image : "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Item saved:", formData);
    alert("Item saved successfully!");
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div className="card shadow-2-strong card-registration custom-card border-0">
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4 text-center fw-bold">Add New Item</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter item name"
                      className="form-control form-control-lg"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Enter quantity"
                      className="form-control form-control-lg"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Optional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Add notes (optional)"
                      className="form-control form-control-lg"
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-select form-select-lg"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="food">Food</option>
                      <option value="drinks">Drinks</option>
                      <option value="fruits">Fruits</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="appliances">Appliances</option>
                      <option value="deodorant">Deodorant</option>
                      <option value="lotion">Lotion</option>
                      <option value="hair">Hair</option>
                      <option value="makeup">Makeup</option>
                      <option value="shoes">Shoes</option>
                      <option value="dresses">Dresses</option>
                      <option value="tops">Tops</option>
                      <option value="jerseys">Jerseys</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="bags">Bags</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="form-control form-control-lg"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <div className="mt-3 text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-fluid rounded shadow"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-2 text-center">
                    <button
                      className="btn btn-success btn-lg px-5"
                      type="submit"
                    >
                      Save
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
