import React, { useEffect, useState } from "react";
import { Contract, formatEther } from "ethers";
import type { BigNumberish } from "ethers";

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
  onSelectJob: (jobId: number) => void; // callback para abrir o formulário de proposta
}

export function JobListToApply({ contract, onSelectJob }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAvailableJobs() {
    setLoading(true);
    try {
      const allJobs: Job[] = await contract.getAllJobs();
      const available = allJobs.filter(job => job.isOpen);
      setJobs(available);
    } catch (error) {
      console.error("Erro ao buscar jobs:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (contract) {
      fetchAvailableJobs();
    }
  }, [contract]);

  return (
    <div>
      <h3>Jobs Disponíveis para Proposta</h3>
      {loading ? (
        <p>Carregando...</p>
      ) : jobs.length === 0 ? (
        <p>Não há jobs disponíveis no momento.</p>
      ) : (
        <ul>
          {jobs.map(job => (
            <li key={job.id.toString()}>
              <strong>{job.description}</strong> - {formatEther(job.budget)} ETH
              <button onClick={() => onSelectJob(Number(job.id))} style={{ marginLeft: "1rem" }}>
                Enviar Proposta
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
