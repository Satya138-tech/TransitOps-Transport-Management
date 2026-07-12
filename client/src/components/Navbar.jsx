function Navbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <h2>TransitOps Dashboard</h2>

      <div>
        <span>👤 Khushi</span>
      </div>
    </div>
  );
}

export default Navbar;