import axios from "axios";
import { useState } from "react";

export default function DeliveryTable({ deliveries, fetchDeliveries }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ trackingNumber: "", carrier: "", status: "" });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      await axios.delete(`http://localhost:5000/api/delivery/${id}`);
      fetchDeliveries();
    }
  };

  const handleEdit = (delivery) => {
    setEditingId(delivery._id);
    setEditData({
      trackingNumber: delivery.trackingNumber || "",
      carrier: delivery.carrier || "",
      status: delivery.status || "Pending",
    });
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/delivery/${id}`, editData);
    setEditingId(null);
    fetchDeliveries();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">📦 Delivery List</h3>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Tracking</th>
            <th className="p-2 border">Carrier</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery._id} className="border-t">
              <td className="p-2 border">{delivery.orderId}</td>
              <td className="p-2 border">{new Date(delivery.date).toLocaleDateString()}</td>
              <td className="p-2 border">{delivery.address}</td>
              <td className="p-2 border">
                {editingId === delivery._id ? (
                  <input
                    className="border px-2 py-1 rounded"
                    value={editData.trackingNumber}
                    onChange={(e) => setEditData({ ...editData, trackingNumber: e.target.value })}
                  />
                ) : (
                  delivery.trackingNumber || "-"
                )}
              </td>
              <td className="p-2 border">
                {editingId === delivery._id ? (
                  <input
                    className="border px-2 py-1 rounded"
                    value={editData.carrier}
                    onChange={(e) => setEditData({ ...editData, carrier: e.target.value })}
                  />
                ) : (
                  delivery.carrier || "-"
                )}
              </td>
              <td className="p-2 border">
                {editingId === delivery._id ? (
                  <select
                    className="border px-2 py-1 rounded"
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      delivery.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : delivery.status === "In Transit"
                        ? "bg-yellow-100 text-yellow-800"
                        : delivery.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {delivery.status || "Pending"}
                  </span>
                )}
              </td>
              <td className="p-2 border">
                {editingId === delivery._id ? (
                  <>
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => handleUpdate(delivery._id)}
                    >
                      Save
                    </button>
                    <button
                      className="text-gray-600 hover:underline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => handleEdit(delivery)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(delivery._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
