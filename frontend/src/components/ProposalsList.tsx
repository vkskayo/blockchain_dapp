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
}

export function ProposalsList({ contract, jobId }: Props) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchProposals() {
    if (!contract) return;
    try {
      const data = await contract.getProposalsByJob(jobId);
      setProposals(data);
    } catch (err) {
      console.error("Erro ao buscar propostas:", err);
    }
  }

  async function acceptProposal(proposalId: BigNumberish) {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.acceptProposal(proposalId);
      await tx.wait();
      alert("Proposta aceita!");
      fetchProposals(); // Atualiza status
    } catch (err) {
      alert("Erro ao aceitar proposta: " + (err as Error).message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProposals();
  }, [contract]);

  return (
    <div>
      <h3>Propostas Recebidas</h3>
      <ul>
        {proposals.map((p) => (
          <li key={p.id.toString()}>
            {p.proposalText} - Freelancer: {p.freelancer} -{" "}
            {p.accepted ? "✅ Aceita" : (
              <button onClick={() => acceptProposal(p.id)} disabled={loading}>
                Aceitar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
