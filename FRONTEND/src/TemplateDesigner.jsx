import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TemplateDesigner() {
  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ label: "", key: "", type: "text" });

  const navigate = useNavigate();

  const addField = () => {
    if (!newField.label || !newField.key || !newField.type) {
      alert("All field properties required.");
      return;
    }

    if (newField.type === "group") {
      setFields([...fields, { ...newField, fields: [] }]);
    } else {
      setFields([...fields, newField]);
    }

    setNewField({ label: "", key: "", type: "text" });
  };

  const addSubField = (groupIndex, subField) => {
    const updated = [...fields];
    updated[groupIndex].fields.push(subField);
    setFields(updated);
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
        placeholder="e.g. Cigarette Recipe"
      />

      <div className="border p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Add Field or Group</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <input
            className="border p-2 rounded"
            placeholder="Label"
            value={newField.label}
            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
          />
          <input
            className="border p-2 rounded"
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
            <option value="group">Group (Machine)</option>
          </select>
          <button
            onClick={addField}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Add
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2">Current Structure:</h3>
      <ul className="space-y-4 mb-6">
        {fields.map((f, i) => (
          <li key={i} className="border p-4 rounded bg-gray-50">
            <div className="font-semibold">{f.label} ({f.key}) – <em>{f.type}</em></div>
            {f.type === "group" && (
              <div className="ml-4 mt-2">
                <h4 className="text-sm mb-1 font-semibold">Subfields:</h4>
                <ul className="mb-2">
                  {f.fields.map((sf, j) => (
                    <li key={j} className="text-sm">
                      ▸ {sf.label} ({sf.key}) – <em>{sf.type}</em>
                    </li>
                  ))}
                </ul>
                <SubFieldForm onAdd={(sf) => addSubField(i, sf)} />
              </div>
            )}
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

// Inline subform for group subfields
function SubFieldForm({ onAdd }) {
  const [sf, setSF] = useState({ label: "", key: "", type: "text" });

  const submit = () => {
    if (!sf.label || !sf.key) return alert("All subfield fields required");
    onAdd(sf);
    setSF({ label: "", key: "", type: "text" });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        className="border p-1 rounded"
        placeholder="Label"
        value={sf.label}
        onChange={(e) => setSF({ ...sf, label: e.target.value })}
      />
      <input
        className="border p-1 rounded"
        placeholder="Key"
        value={sf.key}
        onChange={(e) => setSF({ ...sf, key: e.target.value })}
      />
      <select
        className="border p-1 rounded"
        value={sf.type}
        onChange={(e) => setSF({ ...sf, type: e.target.value })}
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="boolean">Checkbox</option>
      </select>
      <button
        type="button"
        onClick={submit}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
      >
        ➕ Add Subfield
      </button>
    </div>
  );
}

export default TemplateDesigner;
