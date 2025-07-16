import React, { useEffect, useState } from "react";
import type { Contract } from "ethers";

interface Proposal {
  id: number;
  jobId: number;
  freelancer: string;
  proposalText: string;
  accepted: boolean;
  paid: boolean;
}

interface Props {
  contract: Contract;
  account: string;
  refreshTrigger?: boolean; // para atualizar lista quando uma proposta nova for enviada
}

export function SentProposalsList({ contract, account, refreshTrigger }: Props) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contract || !account) return;

    async function fetchProposals() {
      setLoading(true);
      try {
        // Chama getProposalsByFreelancer do contrato
        const rawProposals = await contract.getProposalsByFreelancer(account);
        // Convertendo BigNumber e endereço para tipos JS simples
        const formatted = rawProposals.map((p: any) => ({
          id: Number(p.id),
          jobId: Number(p.jobId),
          freelancer: p.freelancer,
          proposalText: p.proposalText,
          accepted: p.accepted,
          paid: p.paid,
        }));
        setProposals(formatted);
      } catch (err) {
        console.error("Erro ao carregar propostas:", err);
        setProposals([]);
      }
      setLoading(false);
    }

    fetchProposals();
  }, [contract, account, refreshTrigger]);

  if (loading) return <p>Carregando propostas enviadas...</p>;

  if (proposals.length === 0)
    return <p style={{ color: "#555" }}>Você ainda não enviou nenhuma proposta.</p>;

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      {proposals.map((p) => (
        <li
          key={p.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "1rem 1.5rem",
            marginBottom: 16,
            backgroundColor: "#fafafa",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>
            Proposta #{p.id} para Job #{p.jobId}
          </p>
          <p style={{ margin: "0.5rem 0" }}>{p.proposalText}</p>
          <p style={{ margin: 0, color: "#333" }}>
            Status:{" "}
            <span
              style={{
                fontWeight: "600",
                color: p.paid ? "green" : p.accepted ? "orange" : "gray",
              }}
            >
              {p.paid
                ? "Pago"
                : p.accepted
                ? "Aceita, aguardando pagamento"
                : "Pendente de aceite"}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}
