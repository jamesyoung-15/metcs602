import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import VenueDetail from "./pages/VenueDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import "./i18n/i18n";
import "./App.css";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gray-200">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/venue/:id" element={<VenueDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
