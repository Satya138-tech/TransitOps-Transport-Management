import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Driver from './pages/Driver';
import User from './pages/User';
import Vehicle from './pages/Vehicle';
import Auth from './pages/Auth';
import NewTrip from './pages/NewTrip';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/user" element={<User />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/new-trip" element={<NewTrip />} />
        <Route path="/vehicle-registration" element={<Vehicle />} />
      </Routes>
    </Router>
  );
}

export default App;
