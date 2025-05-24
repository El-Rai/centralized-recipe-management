import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchRecipes = async () => {
    const res = await axios.get("http://localhost:5000/recipes");
    setRecipes(res.data);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    if (!window.confirm("Are you sure you want to delete selected recipes?"))
      return;

    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`http://localhost:5000/recipe/${id}`))
      );
      setSelectedIds([]);
      fetchRecipes(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipes");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>All Recipes</h1>
      <Link to="/new">➕ Create New Recipe</Link>
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <>
          <button onClick={deleteSelected} disabled={selectedIds.length === 0}>
            🗑 Delete Selected
          </button>
          <ul>
            {recipes.map((r) => (
              <li key={r.id}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(r.id)}
                  onChange={() => toggleSelect(r.id)}
                />
                <strong>{r.name}</strong> ({r.id}) –{" "}
                <Link to={`/edit/${r.id}`}>Edit</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
