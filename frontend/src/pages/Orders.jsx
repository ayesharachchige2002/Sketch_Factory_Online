import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrdersPage() {
  const [activePage, setActivePage] = useState("Orders");
  const [admin, setAdmin] = useState({ name: "", photo: "" });
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSketch, setSelectedSketch] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    product: "",
    materials: "",
    designSketch: "",
    quantity: "",
    deadline: "",
    shippingAddress: "",
  });
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "HR", icon: "👥", path: "#" },
    { name: "Inventory", icon: "📦", path: "#" },
    { name: "Production", icon: "🏭", path: "/production" },
    { name: "Orders", icon: "📝", path: "/orders" },
    { name: "Finance", icon: "💰", path: "#" },
    { name: "Suppliers", icon: "🚚", path: "#" },
  ];

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: token },
        });
        setAdmin(res.data);
      } catch (err) {
        console.error("Failed to fetch admin:", err.response?.data || err.message);
        navigate("/");
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err.response?.data || err.message);
      }
    };

    fetchAdmin();
    fetchOrders();

    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: res.data.status } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("❌ Error updating order status");
    }
  };

  const handleAddOrder = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/orders", {
        orderId: "ORD" + Date.now(),
        customerName: newOrder.customerName,
        product: newOrder.product,
        materials: newOrder.materials,
        designSketch: newOrder.designSketch,
        quantity: parseInt(newOrder.quantity),
        deadline: newOrder.deadline,
        shippingAddress: newOrder.shippingAddress,
      });

      setOrders([res.data, ...orders]);
      setShowAddModal(false);
      setNewOrder({
        customerName: "",
        product: "",
        materials: "",
        designSketch: "",
        quantity: "",
        deadline: "",
        shippingAddress: "",
      });
    } catch (err) {
      console.error("Failed to add order:", err.response?.data || err.message);
      alert("❌ Failed to create order. Please check required fields.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<span class="bg-yellow-200">$1</span>`);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-60 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col">
        <div className="p-5 border-b border-blue-500">
          <h1 className="text-2xl font-bold">GarmentFactory</h1>
          <p className="text-sm opacity-75 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setActivePage(item.name)}
              className={`flex items-center w-full px-5 py-3 hover:bg-blue-700 hover:text-white transition-all duration-300 ${
                activePage === item.name
                  ? "bg-white text-blue-800 font-semibold rounded-l-full shadow"
                  : "text-blue-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-500">
          <button
            className="w-full text-sm text-blue-100 hover:text-white"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            🔒 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
          <div className="flex items-center gap-3">
            <img
              src={
                admin.photo
                  ? admin.photo
                  : `https://ui-avatars.com/api/?name=${admin.name}&background=0D8ABC&color=fff`
              }
              alt="Admin"
              className="w-10 h-10 rounded-full border"
            />
            <div>
              <p className="font-medium">{admin.name}</p>
              <p className="text-xs text-gray-500">{dateTime}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold">Orders</h2>

          {/* Add Button, Search, Notifications */}
          <div className="flex items-center gap-4">
            {/* 🌟 Cute Add New Order Toggle */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full shadow hover:scale-105 hover:from-purple-600 hover:to-blue-600 transition-transform duration-200"
            >
              <span className="text-lg">➕</span>
              <span className="font-medium">Add Order</span>
            </button>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <span className="absolute left-3 top-2 text-gray-400">🔍</span>
            </div>

            {/* Notifications */}
            <button
              className="relative text-gray-500 hover:text-gray-700"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-6 top-14 w-64 bg-white shadow rounded p-3">
                <p className="text-sm font-semibold mb-2">Notifications</p>
                <ul className="space-y-1">
                  <li className="text-gray-700 text-sm">New order received</li>
                  <li className="text-gray-700 text-sm">Production report updated</li>
                  <li className="text-gray-700 text-sm">Supplier message</li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow p-4 border"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3
                        className="text-lg font-bold"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            `${order.product} (#${order.orderId})`,
                            searchQuery
                          ),
                        }}
                      ></h3>
                      <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: `Customer: ${highlightMatch(
                            order.customerName,
                            searchQuery
                          )}`,
                        }}
                      ></p>
                      <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: `Materials: ${highlightMatch(
                            order.materials,
                            searchQuery
                          )}`,
                        }}
                      ></p>
                      <p className="text-sm text-gray-600">
                        Quantity: {order.quantity}
                      </p>
                      <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: `Shipping Address: ${highlightMatch(
                            order.shippingAddress,
                            searchQuery
                          )}`,
                        }}
                      ></p>
                      <p className="text-sm text-gray-600">
                        Deadline: {new Date(order.deadline).toLocaleDateString()}
                      </p>
                      <p
                        className={`text-sm font-medium mt-1 ${
                          order.status === "Approved"
                            ? "text-green-600"
                            : order.status === "Declined"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        Status: {order.status}
                      </p>
                    </div>
                    <img
                      src={order.designSketch}
                      alt="Design Sketch"
                      className="w-32 h-32 object-cover rounded-lg border cursor-pointer"
                      onClick={() => setSelectedSketch(order.designSketch)}
                    />
                  </div>
                  <div className="flex justify-end mt-3 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(order._id, "Approved")}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order._id, "Declined")}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ❌ Deny
                    </button>
                    <a
                      href={order.designSketch}
                      download
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      ⬇ Download Sketch
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">➕ Add New Order</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Customer Name"
                value={newOrder.customerName}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, customerName: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Product"
                value={newOrder.product}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, product: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Materials"
                value={newOrder.materials}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, materials: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newOrder.quantity}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, quantity: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="url"
                placeholder="Design Sketch URL"
                value={newOrder.designSketch}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, designSketch: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="date"
                placeholder="Deadline"
                value={newOrder.deadline}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, deadline: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                placeholder="Shipping Address"
                value={newOrder.shippingAddress}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    shippingAddress: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
              ></textarea>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrder}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sketch Modal */}
      {selectedSketch && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedSketch(null)}
        >
          <img
            src={selectedSketch}
            alt="Full Design Sketch"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
