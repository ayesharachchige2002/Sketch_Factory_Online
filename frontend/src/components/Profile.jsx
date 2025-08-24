import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [admin, setAdmin] = useState({ name: "", email: "", role: "Admin", photo: "" });
  const [activities, setActivities] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const navigate = useNavigate();

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: token },
        });
        setAdmin(res.data);
        setForm({ name: res.data.name, email: res.data.email, password: "" });
      } catch (err) {
        console.error("Failed to fetch admin profile:", err.message);
        navigate("/"); // Redirect if not logged in
      }
    };

    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/activityLogs", {
          headers: { Authorization: token },
        });
        setActivities(res.data);
      } catch (err) {
        console.error("Failed to fetch activities:", err.message);
      }
    };

    fetchAdmin();
    fetchActivities();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/auth/update",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        { headers: { Authorization: token } }
      );
      setAdmin((prev) => ({ ...prev, ...form }));
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err.message);
      alert("Failed to update profile.");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-white"
          : "bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 text-gray-800"
      }`}
      style={{
        backgroundImage: darkMode
          ? `url('forest-background.jpg')`
          : `url('forest-2560x1440-5k-4k-wallpaper-8k-mist-hills-fog-6505.jpg')`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top Navbar */}
      <header
        className={`flex justify-between items-center px-8 py-4 backdrop-blur-md ${
          darkMode ? "bg-black/30" : "bg-white/40"
        } shadow-md`}
      >
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleTheme}
            className={`text-xl px-3 py-2 rounded-full ${
              darkMode
                ? "bg-white/20 text-yellow-300"
                : "bg-black/20 text-yellow-600"
            } hover:scale-110 transform transition`}
            title="Toggle Theme"
          >
            {darkMode ? "🌙" : "🌞"}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 p-8">
        {/* Profile Summary Card */}
        <div
          className={`flex-1 backdrop-blur-md p-6 rounded-2xl shadow-lg ${
            darkMode ? "bg-black/30" : "bg-white/40"
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <img
              src={
                admin.photo
                  ? admin.photo
                  : `https://ui-avatars.com/api/?name=${admin.name}&background=0D8ABC&color=fff`
              }
              alt="Admin"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
            />
            <h2 className="text-2xl font-bold">{admin.name}</h2>
            <p className="text-gray-400">{admin.email}</p>
            <p className="text-sm bg-blue-500/70 px-3 py-1 rounded-full text-white">
              Role: {admin.role}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* Stats & Activities */}
        <div className="flex-[2] flex flex-col gap-6">
          {/* Quick Stats */}
          <div
            className={`backdrop-blur-md p-6 rounded-2xl shadow-lg ${
              darkMode ? "bg-black/30" : "bg-white/40"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Orders Managed"
                value="124"
                icon="📝"
                color="from-green-400 to-green-600"
              />
              <StatCard
                label="Activity Logs"
                value="57"
                icon="📊"
                color="from-purple-400 to-purple-600"
              />
              <StatCard
                label="Account Age"
                value="2 years"
                icon="⏳"
                color="from-blue-400 to-blue-600"
              />
            </div>
          </div>

          {/* Recent Activities */}
          <div
            className={`backdrop-blur-md p-6 rounded-2xl shadow-lg ${
              darkMode ? "bg-black/30" : "bg-white/40"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
            {activities.length === 0 ? (
              <p className="text-gray-500">No recent activities.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {activities.slice(0, 5).map((activity, index) => (
                  <li key={index} className="flex gap-2">
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
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setEditing(false)}
        >
          <div
            className={`backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md ${
              darkMode ? "bg-black/70 text-white" : "bg-white/80 text-gray-800"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full px-4 py-2 rounded bg-white/40 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-2 rounded bg-white/40 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="New Password (optional)"
                className="w-full px-4 py-2 rounded bg-white/40 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-full bg-gray-500/70 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div
      className={`p-4 rounded-xl shadow-lg bg-gradient-to-br ${color} text-white flex items-center justify-between`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold">{value}</h4>
        <p className="text-xs opacity-80">{label}</p>
      </div>
    </div>
  );
}
