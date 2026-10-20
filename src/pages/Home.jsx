import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ItemCard from "../components/ItemCard";

export default function Home() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  // Carrega as opções dos seletores de filtro
  useEffect(() => {
    async function carregarFiltros() {
      try {
        const [resCat, resLoc] = await Promise.all([
          api.get("/categorias"),
          api.get("/locais"),
        ]);
        setCategorias(resCat.data);
        setLocais(resLoc.data);
      } catch (err) {
        console.error("Erro ao carregar listas dos filtros", err);
      }
    }
    carregarFiltros();
  }, []);

  // Busca e filtra os itens da API
  useEffect(() => {
    async function carregarItens() {
      setLoading(true);
      setErro(false);
      try {
        const params = {};
        if (busca) params.busca = busca;
        if (status) params.status = status;
        if (categoria) params.categoria = categoria;
        if (local) params.local = local;

        const response = await api.get("/itens", { params });
        setItens(response.data);
      } catch (err) {
        setErro(true);
      } finally {
        setLoading(false);
      }
    }

    carregarItens();
  }, [busca, status, categoria, local]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Itens encontrados</h3>
        <Link to="/novo">
          <button>+ Novo item</button>
        </Link>
      </div>

      {/* Controles de busca e filtragem */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status (Todos)</option>
          <option value="aguardando">aguardando</option>
          <option value="devolvido">devolvido</option>
        </select>

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Categoria (Todas)</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Local (Todos)</option>
          {locais.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Exibição dos estados da tela */}
      {loading && <p>Carregando itens...</p>}

      {!loading && erro && (
        <p className="erro-msg">Não foi possível carregar. Verifique sua chave.</p>
      )}

      {!loading && !erro && itens.length === 0 && (
        <p>Nenhum item encontrado.</p>
      )}

      {/* Renderização da lista através do componente ItemCard */}
      {!loading && !erro && itens.length > 0 && (
        <div className="grid-itens">
          {itens.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}