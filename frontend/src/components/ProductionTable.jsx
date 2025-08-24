import axios from "axios";
import { useEffect, useState } from "react";

export default function ProductionTable({ setEditOrder }) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5000/api/production/orders");
    setOrders(res.data);
  };

  // Automatically migrate approved orders (optional)
  const migrateApproved = async () => {
    await axios.post("http://localhost:5000/api/production/migrate-approved");
    fetchOrders(); // Refresh data after migration
  };

  useEffect(() => {
    migrateApproved(); // Fetch and migrate on component mount
  }, []);

  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await axios.delete(`http://localhost:5000/api/production/orders/${id}`);
      fetchOrders();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">Production Orders</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Completed</th>
              <th className="py-2 px-4">Deadline</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order.orderId}</td>
                <td className="py-2 px-4">{order.product}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">{order.unitsCompleted ?? 0}</td>
                <td className="py-2 px-4">
                  {new Date(order.deadline).toLocaleDateString()}
                </td>
                <td
                  className={`py-2 px-4 font-semibold ${
                    order.status === "Completed"
                      ? "text-green-600"
                      : order.status === "Delayed"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {order.status}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => setEditOrder(order)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteOrder(order._id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="py-4 px-4 text-center text-gray-500" colSpan="7">
                  No production orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
