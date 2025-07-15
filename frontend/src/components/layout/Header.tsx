import React from "react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header style={{
      backgroundColor: "#222",
      color: "#fff",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Freelance Platform
        </Link>
      </h1>
      <nav>
        <Link to="/" style={{ color: "white", marginRight: "1rem", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/freelancer" style={{ color: "white", marginRight: "1rem", textDecoration: "none" }}>
          Freelancer
        </Link>
        <Link to="/contratante" style={{ color: "white", textDecoration: "none" }}>
          Contratante
        </Link>
      </nav>
    </header>
  );
}
