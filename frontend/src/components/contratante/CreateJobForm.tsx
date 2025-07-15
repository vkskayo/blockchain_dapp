import React, { useState } from "react";
import { parseEther } from "ethers";
import type { Contract } from "ethers";

interface Props {
  contract?: Contract;
  onJobCreated?: () => void;
}

export function CreateJobForm({ contract, onJobCreated }: Props) {
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contract) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const value = parseEther(budget);
      const tx = await contract.createJob(description, { value });
      await tx.wait();

      setSuccess("Job criado com sucesso!");
      setDescription("");
      setBudget("");
      if (onJobCreated) onJobCreated();
    } catch (err: any) {
      setError(err.message || "Erro ao criar job");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Criar Novo Job</h2>
      <input
        type="text"
        placeholder="Descrição do job"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 12, padding: 8 }}
      />
      <input
        type="number"
        placeholder="Orçamento (ETH)"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        min="0"
        step="0.001"
        required
        style={{ width: "100%", marginBottom: 12, padding: 8 }}
      />
      <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Criando..." : "Criar Job"}
      </button>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: 8 }}>{success}</p>}
    </form>
  );
}
