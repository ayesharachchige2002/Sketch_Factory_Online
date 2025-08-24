import axios from "axios";
import { useState } from "react";

export default function MachineTable({ machines, fetchMachines }) {
  const [newMachine, setNewMachine] = useState({ name: "" });

  const handleAddMachine = async (e) => {
    e.preventDefault();
    if (!newMachine.name) return alert("Enter machine name");
    await axios.post("http://localhost:5000/api/machines", newMachine);
    setNewMachine({ name: "" });
    fetchMachines();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/machines/${id}`, { status });
    fetchMachines();
  };

  const deleteMachine = async (id) => {
    if (window.confirm("Delete this machine?")) {
      await axios.delete(`http://localhost:5000/api/machines/${id}`);
      fetchMachines();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">Machines</h3>

      {/* Add Machine Form */}
      <form onSubmit={handleAddMachine} className="flex gap-3 mb-4">
        <input
          type="text"
          value={newMachine.name}
          onChange={(e) =>
            setNewMachine({ ...newMachine, name: e.target.value })
          }
          placeholder="New Machine Name"
          className="p-2 border rounded flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add
        </button>
      </form>

      {/* Machines Table */}
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4">Machine Name</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Last Maintenance</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr key={machine._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{machine.name}</td>
              <td
                className={`py-2 px-4 font-semibold ${
                  machine.status === "Running"
                    ? "text-green-600"
                    : machine.status === "Maintenance"
                    ? "text-orange-600"
                    : "text-yellow-600"
                }`}
              >
                {machine.status}
              </td>
              <td className="py-2 px-4">
                {new Date(machine.lastMaintenance).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 flex gap-2">
                <select
                  value={machine.status}
                  onChange={(e) =>
                    updateStatus(machine._id, e.target.value)
                  }
                  className="p-1 border rounded"
                >
                  <option value="Running">Running</option>
                  <option value="Idle">Idle</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <button
                  onClick={() => deleteMachine(machine._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
          {machines.length === 0 && (
            <tr>
              <td
                className="py-4 px-4 text-center text-gray-500"
                colSpan="4"
              >
                No machines found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
