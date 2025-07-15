import React, { useState } from "react";
import type { Contract, BigNumberish } from "ethers";

interface Props {
  contract?: Contract;
  jobId: BigNumberish;
}

export function SubmitProposalForm({ contract, jobId }: Props) {
  const [proposalText, setProposalText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contract) return;

    setLoading(true);
    try {
      const tx = await contract.submitProposal(jobId, proposalText);
      await tx.wait();
      alert("Proposta enviada com sucesso!");
      setProposalText("");
    } catch (err) {
      alert("Erro ao enviar proposta: " + (err as Error).message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Sua proposta"
        value={proposalText}
        onChange={e => setProposalText(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        Enviar Proposta
      </button>
    </form>
  );
}
