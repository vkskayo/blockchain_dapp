import React, { useState } from "react";
import type { Contract, BigNumberish } from "ethers";

interface Props {
  contract?: Contract;
  proposalId: BigNumberish;
  onProposalAccepted?: () => void; // callback opcional para atualizar lista ou estado no pai
}

export function AcceptProposalButton({ contract, proposalId, onProposalAccepted }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function accept() {
    if (!contract) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const tx = await contract.acceptProposal(proposalId);
      await tx.wait();
      setSuccess("Proposta aceita com sucesso!");
      if (onProposalAccepted) onProposalAccepted();
    } catch (err: any) {
      setError("Erro ao aceitar proposta: " + (err.message || err));
    }
    setLoading(false);
  }

  return (
    <div>
      <button onClick={accept} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Processando..." : "Aceitar Proposta"}
      </button>
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "0.5rem" }}>{success}</p>}
    </div>
  );
}
