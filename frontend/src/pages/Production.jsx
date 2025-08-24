import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductionDashboard from "../components/ProdactionDashboard.jsx";
import ProductionTable from "../components/ProductionTable.jsx";
import AddOrderForm from "../components/AddOrderForm.jsx";
import MachineTable from "../components/MachineTable.jsx";
import DeliveryTable from "../components/DeliveryTable.jsx"; // ✅ New
import AddDeliveryForm from "../components/AddDeliveryForm.jsx"; // ✅ New

export default function Production() {
  const [orders, setOrders] = useState([]);
  const [machines, setMachines] = useState([]);
  const [deliveries, setDeliveries] = useState([]); // ✅ New
  const [editOrder, setEditOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("Orders");
  const [activePage, setActivePage] = useState("Production");
  const [admin, setAdmin] = useState({ name: "", photo: "" });
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchMachines();
    fetchDeliveries();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5000/api/production/orders");
    setOrders(res.data);
  };

  const fetchMachines = async () => {
    const res = await axios.get("http://localhost:5000/api/machines");
    setMachines(res.data);
  };

  const fetchDeliveries = async () => {
    const res = await axios.get("http://localhost:5000/api/delivery");
    setDeliveries(res.data);
  };

  const clearEdit = () => setEditOrder(null);

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

    fetchAdmin();

    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

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

          <h2 className="text-2xl font-bold">Production</h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <span className="absolute left-3 top-2 text-gray-400">🔍</span>
            </div>
            <button className="relative text-gray-500 hover:text-gray-700">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                2
              </span>
            </button>
          </div>
        </header>

        {/* Main Production Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          <ProductionDashboard orders={orders} machines={machines} />

          {/* Tabs */}
          <div className="flex gap-3 mb-4">
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "Orders"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("Orders")}
            >
              📋 Orders
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "Machines"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("Machines")}
            >
              🏭 Machines
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "Delivery"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("Delivery")}
            >
              🚚 Delivery
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "Orders" && (
            <>
              <AddOrderForm
                fetchOrders={fetchOrders}
                editOrder={editOrder}
                clearEdit={clearEdit}
              /> 
              <ProductionTable
                orders={orders}
                fetchOrders={fetchOrders}
                setEditOrder={setEditOrder}
              />
            </>
          )}

          {activeTab === "Machines" && (
            <MachineTable machines={machines} fetchMachines={fetchMachines} />
          )}

          {activeTab === "Delivery" && (
            <>
              <AddDeliveryForm fetchDeliveries={fetchDeliveries} orders={orders} />
              <DeliveryTable deliveries={deliveries} fetchDeliveries={fetchDeliveries} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
