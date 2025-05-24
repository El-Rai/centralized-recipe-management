import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({
    id: "",
    name: "",
    waterPrep: { waterVolume: "", preheatTemp: "" },
    mixing: { sugarMass: "", mixTime: "" },
    bottling: { bottleSize: "" },
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/recipe/${id}`).then((res) => {
      setRecipe(res.data);
    });
  }, [id]);

  const handleChange = (e, section, field) => {
    const value = e.target.value;
    if (section) {
      setRecipe((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setRecipe((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/recipe/${id}`, recipe);
      alert("Recipe updated!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit Recipe: {id}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={recipe.name}
            onChange={(e) => handleChange(e, null, "name")}
          />
        </label>
        <h3>Water Prep</h3>
        <label>
          Volume:
          <input
            type="number"
            value={recipe.waterPrep.waterVolume}
            onChange={(e) => handleChange(e, "waterPrep", "waterVolume")}
          />
        </label>
        <label>
          Temp:
          <input
            type="number"
            value={recipe.waterPrep.preheatTemp}
            onChange={(e) => handleChange(e, "waterPrep", "preheatTemp")}
          />
        </label>
        <h3>Mixing</h3>
        <label>
          Sugar Mass:
          <input
            type="number"
            value={recipe.mixing.sugarMass}
            onChange={(e) => handleChange(e, "mixing", "sugarMass")}
          />
        </label>
        <label>
          Mix Time:
          <input
            type="number"
            value={recipe.mixing.mixTime}
            onChange={(e) => handleChange(e, "mixing", "mixTime")}
          />
        </label>
        <h3>Bottling</h3>
        <label>
          Bottle Size:
          <input
            type="number"
            value={recipe.bottling.bottleSize}
            onChange={(e) => handleChange(e, "bottling", "bottleSize")}
          />
        </label>
        <br /><br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditRecipe;
