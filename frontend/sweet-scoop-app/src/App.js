import Homepage from "./pages/Homepage";
import FlavorsPage from "./pages/FlavorsPage"
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function ProtectedRoute({ element }) {
    const userId = localStorage.getItem("userId");
    return userId ? element : <Navigate to="/login" />
}

function App() {
  return (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/flavors" element={<ProtectedRoute element={<FlavorsPage />} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/order-history" element={<ProtectedRoute element={<OrderHistoryPage />} />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
