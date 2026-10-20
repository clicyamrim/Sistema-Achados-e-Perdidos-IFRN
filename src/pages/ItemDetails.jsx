// src/pages/ItemDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  const [devolvidoPara, setDevolvidoPara] = useState("");
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  async function carregarItem() {
    setLoading(true);
    setErro(false);
    try {
      const response = await api.get(`/itens/${id}`);
      setItem(response.data);
    } catch (err) {
      setErro(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarItem();
  }, [id]);

  async function handleMarcarDevolvido(e) {
    e.preventDefault();
    if (!devolvidoPara) return;
    try {
      await api.patch(`/itens/${id}/devolver`, { devolvido_para: devolvidoPara });
      setDevolvidoPara("");
      carregarItem();
    } catch (err) {
      alert("Erro ao marcar como devolvido.");
    }
  }

  async function handleExcluir() {
    try {
      await api.delete(`/itens/${id}`);
      navigate("/");
    } catch (err) {
      alert("Erro ao excluir o item.");
    }
  }

  if (loading) return <div className="page-container"><p>Carregando itens...</p></div>;
  if (erro) return <div className="page-container"><p className="erro-msg">Não foi possível carregar. Verifique sua chave.</p></div>;

  return (
    <div className="page-container">
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-start", marginBottom: "1rem" }}>
        <button onClick={() => navigate("/")} className="btn-secondary">← Voltar</button>
      </div>

      <div style={{ background: "white", padding: "2rem", borderRadius: "8px", border: "1px solid #e0e0e0", width: "100%", textAlign: "left" }}>
        <h2 style={{ marginBottom: "1rem", color: "#2e5a1e" }}>{item.nome}</h2>
        <p style={{ marginBottom: "0.5rem" }}><strong>Status:</strong> <span className={`status-tag ${item.status}`}>{item.status}</span></p>
        <p style={{ marginBottom: "0.5rem" }}><strong>Descrição:</strong> {item.descricao}</p>
        <p style={{ marginBottom: "0.5rem" }}><strong>Categoria:</strong> {item.categoria}</p>
        <p style={{ marginBottom: "0.5rem" }}><strong>Local:</strong> {item.local}</p>
        <p style={{ marginBottom: "0.5rem" }}><strong>Encontrado em:</strong> {item.data_encontrado}</p>
        {item.devolvido_para && <p style={{ marginBottom: "0.5rem" }}><strong>Devolvido para:</strong> {item.devolvido_para}</p>}

        <div className="button-group" style={{ marginTop: "1.5rem", justifyContent: "flex-start" }}>
          <Link to={`/editar/${item.id}`}>
            <button>Editar</button>
          </Link>
          <button onClick={() => setConfirmarExclusao(true)} className="btn-danger">Excluir</button>
        </div>
      </div>

      {confirmarExclusao && (
        <div className="box-confirmacao">
          <p>Tem certeza que deseja excluir?</p>
          <div className="button-group">
            <button onClick={handleExcluir} className="btn-danger">Excluir</button>
            <button onClick={() => setConfirmarExclusao(false)} className="btn-secondary">Cancelar</button>
          </div>
        </div>
      )}

      {item.status === "aguardando" && (
        <form onSubmit={handleMarcarDevolvido} className="box-devolver">
          <h4>Marcar como devolvido</h4>
          <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
            <input
              type="text"
              placeholder="Nome de quem recebeu"
              value={devolvidoPara}
              onChange={(e) => setDevolvidoPara(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button type="submit">Confirmar</button>
          </div>
        </form>
      )}
    </div>
  );
}