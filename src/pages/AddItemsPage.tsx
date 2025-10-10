import React from 'react'
import ItemsForm from '../components/ItemsForm'
import ItemCard from '../components/ItemCard'

export default function AddItemsPage() {
  return (
    <div>
      <h1>items</h1>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
      <ItemsForm />
    </div>
  );
}
