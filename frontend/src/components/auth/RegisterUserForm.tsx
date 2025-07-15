import React, { useState } from "react";
import { Contract } from "ethers";

interface Props {
  contract: Contract;
  account: string;
  onRegistered: (role: "freelancer" | "contratante") => void;
}

export function RegisterUserForm({ contract, account, onRegistered }: Props) {
  const [name, setName] = useState("");
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const [_, __, exists] = await contract.getUser(account);
      if (exists) {
        setError("Este endereço já está registrado.");
        setLoading(false);
        return;
      }

      const tx = await contract.registerUser(name, isFreelancer);
      await tx.wait();

      onRegistered(isFreelancer ? "freelancer" : "contratante");
    } catch (err: any) {
      setError("Erro ao registrar: " + (err.message || err));
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Registro de Usuário</h2>
      <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
        O endereço conectado será vinculado permanentemente ao tipo de usuário selecionado.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />

        <label style={{ display: "block", marginBottom: "1rem" }}>
          <input
            type="checkbox"
            checked={isFreelancer}
            onChange={(e) => setIsFreelancer(e.target.checked)}
          />
          {" "}Sou Freelancer
        </label>

        <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
