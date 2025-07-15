import React, { useState } from "react";
import type { Contract, BigNumberish } from "ethers";

interface Props {
  contract: Contract;  // contrato não opcional para evitar necessidade de checar toda hora
  jobId: BigNumberish;
  onProposalSent?: () => void; // callback opcional para informar o pai que enviou
}

export function SubmitProposalForm({ contract, jobId, onProposalSent }: Props) {
  const [proposalText, setProposalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const tx = await contract.submitProposal(jobId, proposalText);
      await tx.wait();
      setSuccess("Proposta enviada com sucesso!");
      setProposalText("");
      if (onProposalSent) onProposalSent();
    } catch (err: any) {
      setError("Erro ao enviar proposta: " + (err.message || err));
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "1rem auto" }}>
      <input
        placeholder="Sua proposta"
        value={proposalText}
        onChange={e => setProposalText(e.target.value)}
        required
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Enviando..." : "Enviar Proposta"}
      </button>
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "0.5rem" }}>{success}</p>}
    </form>
  );
}
