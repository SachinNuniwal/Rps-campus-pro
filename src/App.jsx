import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <Dashboard />
  ) : (
    <Login onLogin={() => setIsLoggedIn(true)} />
  );
}