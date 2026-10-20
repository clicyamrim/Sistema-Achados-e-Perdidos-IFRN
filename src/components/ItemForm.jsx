import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ItemForm({ initialData, onSubmit, onCancel, carregando, mensagem }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");
  const [dataEncontrado, setDataEncontrado] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  // Carrega as categorias e locais disponíveis na API
  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [resCat, resLoc] = await Promise.all([
          api.get("/categorias"),
          api.get("/locais"),
        ]);
        setCategorias(resCat.data);
        setLocais(resLoc.data);
      } catch (err) {
        console.error("Erro ao carregar opções do formulário", err);
      }
    }
    carregarOpcoes();
  }, []);

  // Preenche os campos se estiver no modo de edição
  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || "");
      setDescricao(initialData.descricao || "");
      setCategoria(initialData.categoria || "");
      setLocal(initialData.local || "");
      setDataEncontrado(initialData.data_encontrado || "");
    }
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      nome,
      descricao,
      categoria,
      local,
      data_encontrado: dataEncontrado,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <label>
        Nome:
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </label>

      <label>
        Descrição:
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </label>

      <label>
        Categoria:
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <label>
        Local:
        <select
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {locais.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </label>

      <label>
        Data em que foi encontrado (AAAA-MM-DD):
        <input
          type="date"
          value={dataEncontrado}
          onChange={(e) => setDataEncontrado(e.target.value)}
          required
        />
      </label>

      {mensagem?.texto && (
        <p className={`mensagem ${mensagem.tipo}`}>
          {mensagem.texto}
        </p>
      )}

      <div className="button-group">
        <button type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
}