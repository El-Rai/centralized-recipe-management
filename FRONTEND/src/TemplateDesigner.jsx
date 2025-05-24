import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TemplateDesigner() {
  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ label: "", key: "", type: "text" });
  const navigate = useNavigate();

  const addField = () => {
    if (!newField.label || !newField.key) return alert("All fields required.");
    setFields([...fields, newField]);
    setNewField({ label: "", key: "", type: "text" });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/templates", {
        name: templateName,
        fields,
      });
      alert("Template saved!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to save template.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Template Designer</h1>

      <label className="block mb-2">Template Name</label>
      <input
        className="w-full border p-2 rounded mb-4"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        placeholder="e.g. Lemonade Recipe"
      />

      <div className="border p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Add Field</h2>
        <input
          className="border p-2 rounded mr-2"
          placeholder="Label"
          value={newField.label}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        />
        <input
          className="border p-2 rounded mr-2"
          placeholder="Key"
          value={newField.key}
          onChange={(e) => setNewField({ ...newField, key: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value })}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="boolean">Checkbox</option>
        </select>
        <button
          onClick={addField}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Field
        </button>
      </div>

      <h3 className="text-lg font-bold mb-2">Current Fields:</h3>
      <ul className="mb-6 space-y-2">
        {fields.map((f, i) => (
          <li key={i} className="border p-2 rounded bg-gray-50">
            {f.label} ({f.key}) – <em>{f.type}</em>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        disabled={!templateName || fields.length === 0}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        ✅ Save Template
      </button>
    </div>
  );
}

export default TemplateDesigner;
