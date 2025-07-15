import React, { useState } from "react";
import { ethers } from "ethers";

interface Props {
  contract?: ethers.Contract;
  account?: string;
}

export function RegisterUserForm({ contract, account }: Props) {
  const [name, setName] = useState("");
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contract || !account) return;

    setLoading(true);
    try {
      const [existingName, existingIsFreelancer, exists] = await contract.getUser(account);
      if (exists) {
        alert(`Usuário já registrado: ${existingName} - Freelancer? ${existingIsFreelancer ? "Sim" : "Não"}`);
        setLoading(false);
        return;
      }

      const tx = await contract.registerUser(name, isFreelancer);
      await tx.wait();
      alert("Usuário registrado!");
    } catch (err) {
      alert("Erro ao registrar usuário: " + (err as Error).message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <label>
        <input
          type="checkbox"
          checked={isFreelancer}
          onChange={e => setIsFreelancer(e.target.checked)}
        />
        Freelancer
      </label>
      <button type="submit" disabled={loading}>
        Registrar
      </button>
    </form>
  );
}
