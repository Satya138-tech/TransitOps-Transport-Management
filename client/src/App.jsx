import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "20px" }}>
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default App;