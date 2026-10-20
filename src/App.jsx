import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ItemDetails from "./pages/ItemDetails";
import ItemFormPage from "./pages/ItemFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/novo" element={<ItemFormPage />} />
        <Route path="/editar/:id" element={<ItemFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}