import React, { useState } from "react";
import type { Contract, BigNumberish } from "ethers";
import { JobListToApply } from "../freelancer/JobListToApply";
import { SubmitProposalForm } from "../freelancer/SubmitProposalForm";


interface Props {
  account: string;
  contract: Contract;
}

// Componente placeholder para listar propostas enviadas pelo freelancer
// Você pode implementar depois com lógica semelhante ao ProposalsList, mas filtrando por account
function SentProposalsList({ contract, account }: { contract: Contract; account: string }) {
  // Aqui você pode buscar propostas enviadas pelo freelancer (account)
  // e exibir status (aceita, paga, etc)
  return (
    <div style={{ maxWidth: 700, margin: "1rem auto", color: "#555" }}>
      <p>Componente para listar propostas enviadas pelo freelancer (a implementar).</p>
    </div>
  );
}

export function DashboardFreelancer({ account, contract }: Props) {
  const [selectedJobId, setSelectedJobId] = useState<BigNumberish | null>(null);
  const [refreshJobs, setRefreshJobs] = useState(false);


  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "0 1rem",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h2>Bem-vindo(a), Freelancer</h2>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Conectado como: <code>{account}</code>
        </p>
      </header>

      <section style={{ marginBottom: "3rem" }}>
        <JobListToApply
          contract={contract}
          onSelectJob={setSelectedJobId}
          account={account}
          refreshTrigger={refreshJobs}
        />
      </section>

      {selectedJobId !== null && (
        <section
          style={{
            marginBottom: "3rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: 6,
            backgroundColor: "#fafafa",
          }}
        >
          <h3>Enviar proposta para o Job #{selectedJobId.toString()}</h3>
          <SubmitProposalForm
            contract={contract}
            jobId={selectedJobId}
            onProposalSent={() => {
              setSelectedJobId(null);
              setRefreshJobs((prev) => !prev); // força atualização
            }}
          />

        </section>
      )}

      <section>
        <h3>Propostas Enviadas</h3>
        <SentProposalsList contract={contract} account={account} />
      </section>
    </div>
  );
}
