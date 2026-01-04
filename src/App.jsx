import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PackagesProvider } from './context/PackagesContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TravelPackages from './pages/TravelPackages';
import CabServices from './pages/CabServices';
import FoodDelivery from './pages/FoodDelivery';
import AllServices from './pages/AllServices';
import './App.css';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <PackagesProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/travel-packages" element={<Layout><TravelPackages /></Layout>} />
            <Route path="/cab-services" element={<Layout><CabServices /></Layout>} />
            <Route path="/food-delivery" element={<Layout><FoodDelivery /></Layout>} />
            <Route path="/all-services" element={<Layout><AllServices /></Layout>} />
          </Routes>
        </div>
      </Router>
    </PackagesProvider>
  );
}

export default App;
