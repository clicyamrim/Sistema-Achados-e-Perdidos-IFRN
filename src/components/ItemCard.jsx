import React from "react";
import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  return (
    <Link to={`/item/${item.id}`} className="item-card">
      <h4>{item.nome}</h4>
      <p>{item.descricao}</p>
      <span className={`status-tag ${item.status}`}>
        {item.status}
      </span>
    </Link>
  );
}