function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#1e293b",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>🚛 TransitOps</h2>
      <hr />

      <p>🏠 Dashboard</p>
      <p>🚚 Vehicles</p>
      <p>👨 Drivers</p>
      <p>🛣 Trips</p>
      <p>🔧 Maintenance</p>
      <p>⛽ Fuel & Expenses</p>
      <p>📊 Reports</p>
    </div>
  );
}

export default Sidebar;