import { useState, useEffect } from "react";
import axios from "axios";

export default function AddOrderForm({ fetchOrders, editOrder, clearEdit }) {
  const [form, setForm] = useState({
    orderId: "",
    product: "",
    quantity: "",
    unitsCompleted: "",
    deadline: "",
    status: "In Progress",
  });

  useEffect(() => {
    if (editOrder) {
      setForm(editOrder);
    }
  }, [editOrder]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editOrder) {
        // Update existing order
        await axios.put(
          `http://localhost:5000/api/production/orders/${editOrder._id}`,
          form
        );
        alert("✅ Order updated successfully!");
        clearEdit();
      } else {
        // Create new order
        await axios.post("http://localhost:5000/api/production/orders", form);
        alert("✅ Order created successfully!");
      }
      setForm({
        orderId: "",
        product: "",
        quantity: "",
        unitsCompleted: "",
        deadline: "",
        status: "In Progress",
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save order");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">
        {editOrder ? "✏️ Edit Production Order" : "➕ Add New Production Order"}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="orderId"
          value={form.orderId}
          onChange={handleChange}
          placeholder="Order ID"
          required
          className="p-2 border rounded"
          disabled={!!editOrder} // prevent changing Order ID during edit
        />
        <input
          type="text"
          name="product"
          value={form.product}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="unitsCompleted"
          value={form.unitsCompleted}
          onChange={handleChange}
          placeholder="Units Completed"
          required
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Delayed">Delayed</option>
        </select>
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editOrder ? "💾 Update Order" : "➕ Add Order"}
          </button>
          {editOrder && (
            <button
              type="button"
              className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
              onClick={clearEdit}
            >
              ❌ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
