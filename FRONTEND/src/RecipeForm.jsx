import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RecipeForm() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [recipeId, setRecipeId] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/templates").then((res) => {
      setTemplates(res.data);
    });
  }, []);

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === parseInt(templateId));
    setSelectedTemplate(template);
    setFormData({});
  };

  const handleChange = (path, type, value) => {
    let parsedValue = value;
    if (type === "number") parsedValue = parseFloat(value);
    if (type === "boolean") parsedValue = value === "true";

    setFormData((prev) => {
      const updated = { ...prev };
      let pointer = updated;
      for (let i = 0; i < path.length - 1; i++) {
        pointer[path[i]] = pointer[path[i]] || {};
        pointer = pointer[path[i]];
      }
      pointer[path[path.length - 1]] = parsedValue;
      return updated;
    });
  };

  const renderFields = (fields, path = []) => {
    return fields.map((field, index) => {
      const fieldPath = [...path, field.key];
      if (field.type === "group") {
        return (
          <div key={index} className="mb-6 border p-4 rounded">
            <h4 className="font-semibold mb-2">{field.label}</h4>
            {renderFields(field.fields, fieldPath)}
          </div>
        );
      }

      return (
        <div key={index} className="mb-4">
          <label className="block mb-1">{field.label}</label>
          {field.type === "boolean" ? (
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => handleChange(fieldPath, field.type, e.target.value)}
            >
              <option value="false">False</option>
              <option value="true">True</option>
            </select>
          ) : (
            <input
              type={field.type}
              className="border p-2 rounded w-full"
              onChange={(e) => handleChange(fieldPath, field.type, e.target.value)}
            />
          )}
        </div>
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/recipe", {
        id: recipeId,
        name: recipeName,
        templateId: selectedTemplate.id,
        data: formData,
      });
      alert("Recipe saved!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to save recipe.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create a Recipe</h1>

      <label className="block mb-2">Select Template</label>
      <select
        onChange={(e) => handleTemplateSelect(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
        defaultValue=""
      >
        <option value="" disabled>Select a template...</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {selectedTemplate && (
        <form onSubmit={handleSubmit}>
          <label className="block mt-4">Recipe ID</label>
          <input
            className="border p-2 rounded w-full mb-4"
            value={recipeId}
            onChange={(e) => setRecipeId(e.target.value)}
            required
          />

          <label className="block">Recipe Name</label>
          <input
            className="border p-2 rounded w-full mb-4"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
          />

          {renderFields(selectedTemplate.fields)}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            ✅ Save Recipe
          </button>
        </form>
      )}
    </div>
  );
}

export default RecipeForm;
