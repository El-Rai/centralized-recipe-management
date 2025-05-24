import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    if (!window.confirm("Are you sure you want to delete selected recipes?")) return;

    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`http://localhost:5000/recipe/${id}`))
      );
      setSelectedIds([]);
      fetchRecipes();
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipes");
    }
  };

  const handleExport = () => {
    const json = JSON.stringify(recipes, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recipes-export.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();

    try {
      const importedRecipes = JSON.parse(text);
      for (const recipe of importedRecipes) {
        await axios.post("http://localhost:5000/recipe", recipe);
      }
      alert("Recipes imported successfully!");
      fetchRecipes();
    } catch (err) {
      console.error(err);
      alert("Failed to import recipes. Ensure it's a valid JSON file.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">All Recipes</h1>

      <div className="flex flex-wrap gap-4 items-center mb-6">
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
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ⬇️ Export Recipes
        </button>
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="border border-gray-300 rounded p-2"
        />
      </div>

      <input
        type="text"
        placeholder="Search by name or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />

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
  to={`/recipe/${r.id}`}
  className="text-blue-600 hover:underline mr-2"
>
  View
</Link>
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
