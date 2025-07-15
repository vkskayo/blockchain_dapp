import React, { useState } from "react";
import { parseEther } from "ethers";
import type { Contract } from 'ethers';


interface Props {
  contract?: Contract;
}

export function CreateJobForm({ contract }: Props) {
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.createJob(description, { value: parseEther(budget) });
      await tx.wait();
      alert("Job criado!");
    } catch {
      alert("Erro ao criar job");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} required />
      <input placeholder="Orçamento (ETH)" value={budget} onChange={e => setBudget(e.target.value)} required />
      <button type="submit" disabled={loading}>Criar Job</button>
    </form>
  );
}
