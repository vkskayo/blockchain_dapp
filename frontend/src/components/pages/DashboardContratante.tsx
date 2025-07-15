import React, { useEffect, useState } from "react";
import type { Contract, BigNumberish } from "ethers";
import { formatEther } from "ethers";

import { ProposalsList } from "../contratante/ProposalsList";

interface Job {
  id: BigNumberish;
  employer: string;
  description: string;
  budget: BigNumberish;
  isOpen: boolean;
  acceptedProposalId: BigNumberish;
}

interface Props {
  contract: Contract;
  account?: string;
}

export function DashboardContratante({ contract, account }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState("");

  async function fetchJobs() {
    if (!contract || !account) return;

    setLoadingJobs(true);
    setError("");

    try {
      const allJobs: Job[] = await contract.getAllJobs();
      // Filtra só os jobs do contratante logado
      const myJobs = allJobs.filter((job) =>
        job.employer.toLowerCase() === account.toLowerCase()
      );
      setJobs(myJobs);
    } catch (err: any) {
      setError("Erro ao buscar jobs: " + (err.message || err));
    }

    setLoadingJobs(false);
  }

  useEffect(() => {
    fetchJobs();
  }, [contract, account]);

  if (!account) return <p>Conecte sua carteira para ver seus jobs.</p>;
  if (!contract) return <p>Conectando com o contrato...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>Dashboard Contratante</h2>

      {loadingJobs && <p>Carregando jobs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {jobs.length === 0 && !loadingJobs && (
        <p>Você ainda não criou nenhum job.</p>
      )}

      {jobs.map((job) => (
        <div
          key={job.id.toString()}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: job.isOpen ? "#fff" : "#f8f9fa",
          }}
        >
          <h3>{job.description}</h3>
          <p>
            Orçamento: {formatEther(job.budget)} ETH -{" "}
            {job.isOpen ? "Aberto para propostas" : "Fechado"}
          </p>

          {/* Lista as propostas para este job */}
          <ProposalsList contract={contract} jobId={job.id} />
        </div>
      ))}
    </div>
  );
}
