import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [recipe, setRecipe] = useState({
    id: '',
    name: '',
    waterPrep: {
      waterVolume: '',
      preheatTemp: ''
    },
    mixing: {
      sugarMass: '',
      mixTime: ''
    },
    bottling: {
      bottleSize: ''
    }
  });

  const handleChange = (e, section, field) => {
    const value = e.target.value;

    if (section) {
      setRecipe(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setRecipe(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting recipe:", recipe); // ✅ ADD THIS LINE

  try {
    const response = await axios.post("http://localhost:5000/recipe", recipe);
    alert("Recipe saved successfully!");
  } catch (error) {
    console.error("Full Axios error:", error);
    if (error.response) {
      console.error("Backend responded with:", error.response.data);
    } else {
      console.error("Network or CORS issue:", error.message);
    }
    alert("Failed to save recipe.");
  }
};


  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Create a Recipe</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Recipe ID:
          <input
            type="text"
            value={recipe.id}
            onChange={(e) => handleChange(e, null, 'id')}
            required
          />
        </label>
        <br /><br />

        <label>
          Recipe Name:
          <input
            type="text"
            value={recipe.name}
            onChange={(e) => handleChange(e, null, 'name')}
            required
          />
        </label>
        <br /><br />

        <h3>Water Preparation</h3>
        <label>
          Water Volume (L):
          <input
            type="number"
            value={recipe.waterPrep.waterVolume}
            onChange={(e) => handleChange(e, 'waterPrep', 'waterVolume')}
          />
        </label>
        <br />
        <label>
          Preheat Temperature (°C):
          <input
            type="number"
            value={recipe.waterPrep.preheatTemp}
            onChange={(e) => handleChange(e, 'waterPrep', 'preheatTemp')}
          />
        </label>

        <h3>Mixing</h3>
        <label>
          Sugar Mass (kg):
          <input
            type="number"
            value={recipe.mixing.sugarMass}
            onChange={(e) => handleChange(e, 'mixing', 'sugarMass')}
          />
        </label>
        <br />
        <label>
          Mixing Time (min):
          <input
            type="number"
            value={recipe.mixing.mixTime}
            onChange={(e) => handleChange(e, 'mixing', 'mixTime')}
          />
        </label>

        <h3>Bottling</h3>
        <label>
          Bottle Size (L):
          <input
            type="number"
            value={recipe.bottling.bottleSize}
            onChange={(e) => handleChange(e, 'bottling', 'bottleSize')}
          />
        </label>

        <br /><br />
        <button type="submit">Save Recipe</button>
      </form>
    </div>
  );
}

export default App;
