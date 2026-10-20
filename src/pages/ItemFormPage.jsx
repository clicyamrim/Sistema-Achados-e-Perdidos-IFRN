import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ItemForm from "../components/ItemForm";

export default function ItemFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    if (isEditing) {
      async function carregarDados() {
        try {
          const response = await api.get(`/itens/${id}`);
          setInitialData(response.data);
        } catch (err) {
          setMensagem({ tipo: "erro", texto: "Não foi possível carregar os dados do item." });
        }
      }
      carregarDados();
    }
  }, [id, isEditing]);

  async function handleSubmit(formData) {
    setCarregando(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      if (isEditing) {
        await api.put(`/itens/${id}`, formData);
        setMensagem({ tipo: "sucesso", texto: "Item atualizado com sucesso!" });
      } else {
        await api.post("/itens", formData);
        setMensagem({ tipo: "sucesso", texto: "Item cadastrado com sucesso!" });
      }
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      if (err.response?.data?.detail) {
        setMensagem({ tipo: "erro", texto: `Erro: ${err.response.data.detail}` });
      } else {
        setMensagem({ tipo: "erro", texto: "Erro ao salvar item. Verifique os dados." });
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{isEditing ? "Editar item" : "Novo item"}</h2>
      <ItemForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
        carregando={carregando}
        mensagem={mensagem}
      />
    </div>
  );
}