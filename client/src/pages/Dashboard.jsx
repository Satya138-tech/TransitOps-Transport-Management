import DashboardCard from "../components/DashboardCard";
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <h3>Welcome to TransitOps 🚛</h3>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            background: "#2563eb",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "180px",
          }}
        >
          <h2>25</h2>
          <p>Active Vehicles</p>
        </div>

        <div
          style={{
            background: "#16a34a",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "180px",
          }}
        >
          <h2>18</h2>
          <p>Drivers On Duty</p>
        </div>

        <div
          style={{
            background: "#f97316",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "180px",
          }}
        >
          <h2>12</h2>
          <p>Active Trips</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;