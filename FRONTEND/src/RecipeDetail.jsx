import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/recipe/${id}`).then((res) => {
      setRecipe(res.data);
    });
  }, [id]);

  const renderData = (data) => {
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="ml-4 mt-1">
        {typeof value === "object" && value !== null ? (
          <>
            <strong>{key}</strong>:
            <div className="ml-4 border-l pl-2">
              {renderData(value)}
            </div>
          </>
        ) : (
          <div>
            <strong>{key}</strong>: {value.toString()}
          </div>
        )}
      </div>
    ));
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">{recipe.name}</h1>
      <p className="mb-2 text-gray-600">ID: {recipe.id}</p>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Recipe Data:</h2>
        {renderData(recipe.data)}
      </div>

      <div className="mt-6 flex gap-4">
        <Link
          to={`/edit/${recipe.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ✏️ Edit Recipe
        </Link>
        <Link to="/" className="text-blue-600 underline">
          ← Back to List
        </Link>
      </div>
    </div>
  );
}

export default RecipeDetail;
