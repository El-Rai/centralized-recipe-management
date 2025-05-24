import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditRecipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [recipeName, setRecipeName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/recipe/${id}`).then((res) => {
      setRecipe(res.data);
      setRecipeName(res.data.name);
      setFormData(res.data.data);

      return axios.get(`http://localhost:5000/templates/${res.data.templateId}`);
    }).then((res) => {
      setTemplate(res.data);
    });
  }, [id]);

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
      const currentValue = fieldPath.reduce((obj, key) => obj?.[key], formData) || "";

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
              value={currentValue ? "true" : "false"}
              onChange={(e) => handleChange(fieldPath, field.type, e.target.value)}
            >
              <option value="false">False</option>
              <option value="true">True</option>
            </select>
          ) : (
            <input
              type={field.type}
              className="border p-2 rounded w-full"
              value={currentValue}
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
      await axios.put(`http://localhost:5000/recipe/${id}`, {
        name: recipeName,
        data: formData,
      });
      alert("Recipe updated!");
      navigate(`/recipe/${id}`);
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  if (!template) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Recipe: {id}</h1>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Recipe Name</label>
        <input
          className="border p-2 rounded w-full mb-4"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
        />

        {renderFields(template.fields)}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4"
        >
          ✅ Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditRecipe;
