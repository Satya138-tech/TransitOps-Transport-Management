function DashboardCard({ title, value, color }) {
  return (
    <div
      style={{
        background: color,
        color: "white",
        padding: "20px",
        borderRadius: "12px",
        width: "200px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      }}
    >
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

export default DashboardCard;