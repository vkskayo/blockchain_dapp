import React, { useEffect, useState } from "react";
import type { Contract, BigNumberish } from "ethers";

interface Proposal {
  id: BigNumberish;
  jobId: BigNumberish;
  freelancer: string;
  proposalText: string;
  accepted: boolean;
  paid: boolean;
}

interface Props {
  contract?: Contract;
  jobId: BigNumberish;
  onProposalsUpdated?: () => void; // opcional, para notificar pai
}

export function ProposalsList({ contract, jobId, onProposalsUpdated }: Props) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchProposals() {
    if (!contract) return;
    try {
      const data = await contract.getProposalsByJob(jobId);
      setProposals(data);
    } catch (err) {
      console.error("Erro ao buscar propostas:", err);
      setError("Erro ao buscar propostas.");
    }
  }

  async function acceptProposal(proposalId: BigNumberish) {
    if (!contract) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const tx = await contract.acceptProposal(proposalId);
      await tx.wait();
      setSuccess("Proposta aceita com sucesso!");
      await fetchProposals();
      if (onProposalsUpdated) onProposalsUpdated();
    } catch (err: any) {
      setError("Erro ao aceitar proposta: " + (err.message || err));
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchProposals();
  }, [contract, jobId]);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h3>Propostas Recebidas</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {proposals.length === 0 && <p>Nenhuma proposta ainda.</p>}
        {proposals.map((p) => (
          <li
            key={p.id.toString()}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: 4,
              backgroundColor: p.accepted ? "#d4edda" : "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p><strong>Freelancer:</strong> {p.freelancer}</p>
              <p>{p.proposalText}</p>
              {p.accepted && <p style={{ color: "green" }}>✅ Aceita</p>}
            </div>
            {!p.accepted && (
              <button onClick={() => acceptProposal(p.id)} disabled={loading}>
                {loading ? "Processando..." : "Aceitar"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
