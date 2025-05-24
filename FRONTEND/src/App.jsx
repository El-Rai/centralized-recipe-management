import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');


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
  <div className="max-w-4xl mx-auto p-8">
    <h1 className="text-3xl font-bold mb-6">All Recipes</h1>

    <div className="flex justify-between items-center mb-4">
      <Link
        to="/new"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ➕ Create New Recipe
      </Link>
      <button
        onClick={deleteSelected}
        disabled={selectedIds.length === 0}
        className={`px-4 py-2 rounded ${
          selectedIds.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        🗑 Delete Selected
      </button>
    </div>

    {/* ✅ Add the search bar right here: */}
    <input
      type="text"
      placeholder="Search by name or ID..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full mb-4 p-2 border border-gray-300 rounded"
    />

    {/* Recipe list below */}
    <ul className="space-y-4">
      {recipes
        .filter((r) =>
          `${r.name} ${r.id}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((r) => (
          <li
            key={r.id}
            className="border border-gray-300 rounded p-4 flex justify-between items-center"
          >
            <div>
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedIds.includes(r.id)}
                onChange={() => toggleSelect(r.id)}
              />
              <span className="font-semibold">{r.name}</span>{" "}
              <span className="text-sm text-gray-500">({r.id})</span>
            </div>
            <Link
              to={`/edit/${r.id}`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>
          </li>
        ))}
    </ul>
  </div>
);

}

export default App;
