import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJSBase,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJSBase.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [admin, setAdmin] = useState({ name: "", photo: "" });
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const productionChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Monthly Production: Actual vs Target",
        font: { size: 18 },
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 100 },
      },
    },
  };

  useEffect(() => {
    // Fetch admin details
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: token },
        });
        setAdmin(res.data);
      } catch (err) {
        console.error("Failed to fetch admin:", err.response?.data || err.message);
        navigate("/"); // Redirect to login
      }
    };

    // Fetch production data
    const fetchProductionData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/chartOverviewAPI/overview"
        );

        const apiData = res.data;

        const config = {
          labels: apiData.map((item) => item.month),
          datasets: [
            {
              type: "bar",
              label: "Units Produced",
              data: apiData.map((item) => item.totalUnits),
              backgroundColor: "rgba(59, 130, 246, 0.6)", // blue bars
              borderRadius: 6,
            },
            {
              type: "line",
              label: "Target Units",
              data: apiData.map((item) => item.targetUnits),
              borderColor: "rgba(234, 179, 8, 1)", // yellow line
              backgroundColor: "rgba(234, 179, 8, 0.2)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "white",
              pointBorderColor: "rgba(234, 179, 8, 1)",
            },
          ],
        };

        setChartData(config);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch production chart data:", err.message);
        setError("Failed to load production data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
    fetchProductionData();

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
              onClick={() => navigate("/Profile")}
              src={
                admin.photo
                  ? admin.photo
                  : `https://ui-avatars.com/api/?name=${admin.name}&background=0D8ABC&color=fff`
              }
              alt="Admin"
              className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:scale-105 transition"
            />
            <div>
              <p className="font-medium">{admin.name}</p>
              <p className="text-xs text-gray-500">{dateTime}</p>
            </div>
          </div>

          {/* Notifications */}
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
                3
              </span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Human Resources"
              subtitle="6 New Joinees | 95% Attendance"
              icon="👥"
              color="from-blue-400 to-blue-600"
            />
            <DashboardCard
              title="Inventory"
              subtitle="850 SKUs | 3 Low Stock Alerts"
              icon="📦"
              color="from-green-400 to-green-600"
            />
            <DashboardCard
              title="Production"
              subtitle="12 Machines Running | 5 Alerts"
              icon="🏭"
              color="from-indigo-400 to-indigo-600"
              onClick={() => navigate("/production")}
            />
            <DashboardCard
              title="Orders"
              subtitle="32 Today | 5 Delayed"
              icon="📝"
              color="from-yellow-400 to-yellow-600"
              onClick={() => navigate("/orders")}
            />
            <DashboardCard
              title="Finance"
              subtitle="$85,200 Invoices | $34k Pending"
              icon="💰"
              color="from-purple-400 to-purple-600"
            />
            <DashboardCard
              title="Suppliers"
              subtitle="5 Active | 2 Pending"
              icon="🚚"
              color="from-red-400 to-red-600"
            />
          </div>

          {/* 📊 Production Chart */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-3">Production Overview</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
            ) : chartData ? (
              <Line data={chartData} options={productionChartOptions} />
            ) : (
              <p>No data available</p>
            )}
          </div>

          {/* 🗒 Recent Activities */}
          <RecentActivities />
        </main>
      </div>
    </div>
  );
}

function DashboardCard({ title, subtitle, icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl shadow cursor-pointer bg-gradient-to-br ${color} text-white hover:scale-105 transform transition-transform duration-300`}
    >
      <div className="flex items-center space-x-3">
        <div className="text-4xl">{icon}</div>
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-xs opacity-80">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/activityLogs", {
          headers: { Authorization: token },
        });
        setActivities(res.data); 
        setError(null);
      } catch (err) {
        console.error("Failed to fetch activities:", err.message);
        setError("Failed to load recent activities");
      } finally {
        setLoading(false);
      }
    };

    // Fetch activities initially
    fetchActivities();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchActivities, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h4 className="font-semibold mb-3">Recent Activities</h4>
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-2 bg-red-50 rounded">{error}</div>
      ) : activities.length === 0 ? (
        <p className="text-gray-500">No recent activities.</p>
      ) : (
        <ul className="space-y-2 text-sm text-gray-600">
          {activities.slice(0, 5).map((activity, index) => (
            <li key={index} className="flex items-start gap-2">
              <span>
                {activity.type === "success" && "✅"}
                {activity.type === "info" && "📦"}
                {activity.type === "warning" && "⚠️"}
                {activity.type === "error" && "❌"}
              </span>
              <div>
                {activity.message}
                <div className="text-xs text-gray-400">
                  {new Date(activity.createdAt).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
