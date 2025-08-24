import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProductionDashboard({ orders = [], machines = [] }) {
  // ✅ Orders stats
  const totalOrders = orders.length;
  const inProgress = orders.filter((o) => o.status === "In Progress").length;
  const completed = orders.filter((o) => o.status === "Completed").length;
  const delayed = orders.filter((o) => o.status === "Delayed").length;

  // ✅ Machines stats
  const totalMachines = machines.length;
  const running = machines.filter((m) => m.status === "Running").length;
  const idle = machines.filter((m) => m.status === "Idle").length;
  const maintenance = machines.filter((m) => m.status === "Maintenance").length;

  // Calculate percentages for tooltips
  const orderPercentages = [
    Math.round((inProgress / totalOrders) * 100) || 0,
    Math.round((completed / totalOrders) * 100) || 0,
    Math.round((delayed / totalOrders) * 100) || 0,
  ];

  const machinePercentages = [
    Math.round((running / totalMachines) * 100) || 0,
    Math.round((idle / totalMachines) * 100) || 0,
    Math.round((maintenance / totalMachines) * 100) || 0,
  ];

  // 🌟 Chart Data with improved color palette
  const orderPieData = {
    labels: ["In Progress", "Completed", "Delayed"],
    datasets: [
      {
        data: [inProgress, completed, delayed],
        backgroundColor: ["#3B82F6", "#10B981", "#EF4444"], // blue-500, emerald-500, red-500
        hoverBackgroundColor: ["#2563EB", "#059669", "#DC2626"], // darker shades on hover
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const machinePieData = {
    labels: ["Running", "Idle", "Maintenance"],
    datasets: [
      {
        data: [running, idle, maintenance],
        backgroundColor: ["#10B981", "#EAB308", "#F97316"], // emerald-500, yellow-500, orange-500
        hoverBackgroundColor: ["#059669", "#CA8A04", "#EA580C"], // darker shades
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  // Chart options with improved tooltips
  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = context.datasetIndex === 0 
              ? orderPercentages[context.dataIndex] 
              : machinePercentages[context.dataIndex];
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        displayColors: true,
        backgroundColor: '#1F2937',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
      },
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      }
    },
    cutout: '65%',
    maintainAspectRatio: false,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Orders Overview */}
      <div className="rounded-xl p-6 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="p-2 bg-blue-100 rounded-full">
              📦
            </span>
            <span>Orders Overview</span>
          </h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {totalOrders} total
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white p-3 rounded-lg shadow-sm text-center hover:shadow-md hover:bg-blue-50 transition-all">
            <div className="text-blue-500 font-bold text-lg">{inProgress}</div>
            <div className="text-xs text-gray-500">In Progress</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center hover:shadow-md hover:bg-emerald-50 transition-all">
            <div className="text-emerald-500 font-bold text-lg">{completed}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center hover:shadow-md hover:bg-red-50 transition-all">
            <div className="text-red-500 font-bold text-lg">{delayed}</div>
            <div className="text-xs text-gray-500">Delayed</div>
          </div>
        </div>
        
        <div className="h-64 bg-white rounded-lg shadow-inner p-2 hover:shadow-md transition-all">
          <Pie data={orderPieData} options={chartOptions} />
        </div>
      </div>

      {/* Machines Overview */}
      <div className="rounded-xl p-6 shadow-lg bg-gradient-to-br from-green-50 to-teal-50 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="p-2 bg-green-100 rounded-full">
              🏭
            </span>
            <span>Machines Overview</span>
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            {totalMachines} total
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white p-3 rounded-lg shadow-sm text-center hover:shadow-md hover:bg-emerald-50 transition-all">
            <div className="text-emerald-500 font-bold text-lg">{running}</div>
            <div className="text-xs text-gray-500">Running</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center hover:shadow-md hover:bg-yellow-50 transition-all">
            <div className="text-yellow-500 font-bold text-lg">{idle}</div>
            <div className="text-xs text-gray-500">Idle</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center hover:shadow-md hover:bg-orange-50 transition-all">
            <div className="text-orange-500 font-bold text-lg">{maintenance}</div>
            <div className="text-xs text-gray-500">Maintenance</div>
          </div>
        </div>
        
        <div className="h-64 bg-white rounded-lg shadow-inner p-2 hover:shadow-md transition-all">
          <Pie data={machinePieData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}