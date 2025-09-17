import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContactsPage from "./pages/ContactsPage";
import "./styles.css";

function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={token ? <Navigate to="/contacts" /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!token ? <LoginPage /> : <Navigate to="/contacts" />} 
          />
          <Route 
            path="/register" 
            element={!token ? <RegisterPage /> : <Navigate to="/contacts" />} 
          />
          <Route 
            path="/contacts" 
            element={token ? <ContactsPage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;