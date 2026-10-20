import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Header() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const response = await api.get("/eu");
        setUsuario(response.data);
      } catch (err) {
        console.error("Erro ao carregar usuário", err);
      }
    }
    carregarUsuario();
  }, []);

  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h2>Achados e Perdidos IFRN</h2>
      </Link>
      <div>{usuario ? `Olá, ${usuario.nome}` : "Carregando..."}</div>
    </header>
  );
}