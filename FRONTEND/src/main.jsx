import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import EditRecipe from "./EditRecipe";
import RecipeDetail from "./RecipeDetail";
import CreateRecipe from "./CreateRecipe";
import CreateTemplate from "./CreateTemplate";
import Login from "./Login";
import "./index.css";

function Root() {
  // Auth state reads from localStorage
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });

  const isAuthenticated = !!auth.token;
  const isAdmin = auth.role === "admin";

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route: login */}
        <Route path="/login" element={<Login setAuth={setAuth} />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={isAuthenticated ? <App isAdmin={isAdmin} /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit/:id"
          element={isAuthenticated && isAdmin ? <EditRecipe /> : <Navigate to="/" />}
        />
        <Route
          path="/create"
          element={isAuthenticated && isAdmin ? <CreateRecipe /> : <Navigate to="/" />}
        />
        <Route
          path="/template"
          element={isAuthenticated && isAdmin ? <CreateTemplate /> : <Navigate to="/" />}
        />
        <Route
          path="/recipe/:id"
          element={isAuthenticated ? <RecipeDetail isAdmin={isAdmin} /> : <Navigate to="/login" />}
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
