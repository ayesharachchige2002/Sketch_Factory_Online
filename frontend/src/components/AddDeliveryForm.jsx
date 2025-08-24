import { useState } from "react";
import axios from "axios";

export default function AddDeliveryForm({ fetchDeliveries, orders }) {
  const [formData, setFormData] = useState({
    orderId: "",
    date: "",
    address: "",
    status: "Pending",
    trackingNumber: "",
    carrier: "",
  });

  const completedOrders = orders.filter(
    (o) => o.status?.toLowerCase() === "completed"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/delivery", formData);
    setFormData({
      orderId: "",
      date: "",
      address: "",
      status: "Pending",
      trackingNumber: "",
      carrier: "",
    });
    fetchDeliveries();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
      <h3 className="text-lg font-semibold">➕ Add Delivery</h3>
      <div className="grid grid-cols-3 gap-4">
        <select
          name="orderId"
          value={formData.orderId}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded"
        >
          <option value="">Select Completed Order</option>
          {completedOrders.map((order) => (
            <option key={order._id} value={order.orderId}>
              {order.orderId} - {order.product}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="px-3 py-2 border rounded"
        >
          <option>Pending</option>
          <option>Shipped</option>
          <option>In Transit</option>
          <option>Delivered</option>
        </select>

        <input
          type="text"
          name="trackingNumber"
          placeholder="Tracking Number"
          value={formData.trackingNumber}
          onChange={handleChange}
          className="px-3 py-2 border rounded"
        />

        <input
          type="text"
          name="carrier"
          placeholder="Carrier (e.g., DHL)"
          value={formData.carrier}
          onChange={handleChange}
          className="px-3 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
