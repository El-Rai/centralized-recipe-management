import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import RecipeForm from './RecipeForm';
import EditRecipe from './EditRecipe';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/new" element={<RecipeForm />} />
        <Route path="/edit/:id" element={<EditRecipe />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
