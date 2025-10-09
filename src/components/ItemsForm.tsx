import React from 'react'

export default function ItemsForm() {
  return (
    <div>
      <form>
        <div className="mb-3">
          <label htmlFor="itemName" className="form-label">
            Item Name
          </label>
          <input
            type="text"
            className="form-control"
            id="itemName"
            name="itemName"
            placeholder="Enter item name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="itemName" className="form-label">
            Quantity 
          </label>
          <input
            type="Number"
            className="form-control"
            id="itemNotes"
            name="itemNotes"
            placeholder="optional notes"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="itemCategory" className="form-label">
            Category
          </label>
          <select
            className="form-select"
            id="itemCategory"
            name="itemCategory"
            required
          >
            <option value="">Choose...</option>
            <option value="food">food</option>
            <option value="dairy">dairy</option>
            <option value="drinks">drinks</option>
            <option value="fruits">fruits</option>
            <option value="veggies">veggies</option>
            <option value="appliences">appliences</option>
            <option value="deodorant">deodorant</option>
            <option value="lotion">lotion</option>
            <option value="hair">hair</option>
            <option value="shoes">shoes</option>
            <option value="dresses">dresses</option>
            <option value="tops">tos</option>
            <option value="jerseys">jerseys</option>
            <option value="bags">bags</option>
          </select>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="itemAvailable"
            name="itemAvailable"
          />
          <label className="form-check-label" htmlFor="itemAvailable">
            Available
          </label>
        </div>

        <button type="submit" className="btn btn-success">
          Add Item
        </button>
      </form>
    </div>
  );
}
